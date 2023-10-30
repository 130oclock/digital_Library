require('dotenv').config();
const express = require('express');
const mariadb = require('mariadb');
const app = express();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

async function fetchConn() {
    let conn = await pool.getConnection();
    // console.log('Active connections: ', pool.activeConnections());
    return conn;
}

const hostname = process.env.PUBLISH === 'true' ? process.env.IP_ADDRESS : process.env.LOCALHOST;
const port = process.env.DEV_PORT;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use('/favicon.ico', express.static(__dirname + '/public/images/favicon.ico'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/add-book', (req, res) => {
    res.sendFile(__dirname + '/public/add-book.html');
});

app.get('/genres', (req, res) => {
    res.sendFile(__dirname + '/public/lists/genres.json');
});

app.get('/books/all', async (req, res) => {
    // get all rows from the book table
    // and all genres and authors related to that book.
    const request = `
    SELECT
        books.book_id AS id,
        books.title AS title,
        books.page AS page,
        books.total_pages AS pageTotal,
        books.published_date AS date,
        authors_ AS authors,
        genres_ AS genres
    FROM books
    INNER JOIN (
        SELECT
            books.book_id AS book_id,
            GROUP_CONCAT(
                CONCAT_WS(' ', first_name, middle_name, last_name)
                ORDER BY last_name ASC
                SEPARATOR ', ') AS authors_
        FROM books
        INNER JOIN book_authors
        ON book_authors.book_id = books.book_id
        INNER JOIN authors
        ON book_authors.author_id = authors.author_id
        GROUP BY books.book_id
    ) authors_ ON books.book_id = authors_.book_id
    INNER JOIN (
        SELECT
            books.book_id AS book_id,
            GROUP_CONCAT(
                genre_name
                SEPARATOR ', ') AS genres_
        FROM books
        INNER JOIN book_genres
        ON book_genres.book_id = books.book_id
        INNER JOIN genres
        ON book_genres.genre_id = genres.genre_id
        GROUP BY books.book_id
    ) genres_ ON books.book_id = genres_.book_id
    WHERE mark_delete = FALSE`;

    let conn;
    try {
        conn = await fetchConn();
        const rows = await conn.query(request);

        res.status(200).send(rows);
    } catch (err) {
        res.sendStatus(408);
        throw err;
    } finally {
        if (conn) conn.end();
    }
});

app.get('/books/:id', async (req, res) => {
    // get all rows from the book table
    // and all genres and authors related to that book.
    const request = `
    SELECT
        books.book_id AS id,
        books.title AS title,
        books.page AS page,
        books.total_pages AS pageTotal,
        books.published_date AS date,
        authors_ AS authors,
        genres_ AS genres
    FROM books
    INNER JOIN (
        SELECT
            books.book_id AS book_id,
            GROUP_CONCAT(
                CONCAT_WS(' ', first_name, middle_name, last_name)
                ORDER BY last_name ASC
                SEPARATOR ', ') AS authors_
        FROM books
        INNER JOIN book_authors
        ON book_authors.book_id = books.book_id
        INNER JOIN authors
        ON book_authors.author_id = authors.author_id
        GROUP BY books.book_id
    ) authors_ ON books.book_id = authors_.book_id
    INNER JOIN (
    SELECT
        books.book_id AS book_id,
        GROUP_CONCAT(
            genre_name
            SEPARATOR ', ') AS genres_
    FROM books
    INNER JOIN book_genres
    ON book_genres.book_id = books.book_id
    INNER JOIN genres
    ON book_genres.genre_id = genres.genre_id
    GROUP BY books.book_id
    ) genres_ ON books.book_id = genres_.book_id
    WHERE books.book_id = ?`;

    let conn;
    try {
        conn = await fetchConn();
        const rows = await conn.query(request, [req.params.id]);

        res.status(200).send(rows);
    } catch (err) {
        res.sendStatus(408);
        throw err;
    } finally {
        if (conn) conn.end();
    }
});

app.get('/authors/all', async (req, res) => {
    // get all rows from the author table
    const request = `
    SELECT
        authors.author_id AS id,
        CONCAT_WS(' ', first_name, middle_name, last_name) AS name
    FROM authors
    ORDER BY name ASC`;

    let conn;
    try {
        conn = await fetchConn();
        const rows = await conn.query(request);

        res.status(200).send(rows);
    } catch (err) {
        res.sendStatus(408);
        throw err;
    } finally {
        if (conn) conn.end();
    }
});

app.post('/add-book', async (req, res) => {
    const data = req.body;
    const authors = JSON.parse(data.authors);
    const genres = JSON.parse(data.genres);
    console.log("POST /add-book:", data.title, data.date, data.totalPages, authors, genres);

    let conn;
    try {
        conn = await fetchConn();
        // insert a new book into the books table
        const insertBook = "INSERT INTO books (title, published_date, total_pages) VALUES (?, ?, ?)";
        await conn.query(insertBook, [data.title, data.date, data.totalPages]);
        // get the id of the book
        let newBookID = await conn.query("SELECT LAST_INSERT_ID()");
        newBookID = newBookID[0]["LAST_INSERT_ID()"];
        // insert a new junction into the book_authors table for each author
        const insertBookAuthor = "INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)";
        const insertNewAuthor = "INSERT INTO authors (first_name, middle_name, last_name) VALUES (?, ?, ?)";
        const insertBookNewAuthor = "INSERT INTO book_authors (book_id, author_id) VALUES (?, LAST_INSERT_ID())";
        for (let i = 0; i < authors.length; i++) {
            let author = authors[i];
            if (typeof author === 'object') {
                await conn.query(insertNewAuthor, [author.first, author.middle, author.last]);
                await conn.query(insertBookNewAuthor, [newBookID]);
                continue;
            }
            await conn.query(insertBookAuthor, [newBookID, author]);
        }
        // insert a new junction into the book_genres table for each genre
        const insertBookGenre = "INSERT INTO book_genres (book_id, genre_id) VALUES (?, ?)";
        for (let i = 0; i < genres.length; i++) {
            await conn.query(insertBookGenre, [newBookID, genres[i]]);
        }

        res.status(200).send({ "redirect": '/'});
    } catch (err) {
        res.sendStatus(408);
        throw err;
    } finally {
        if (conn) conn.end();
    }
});

/*app.post('/edit-data', async (req, res) => {
    const data = req.body;
    let query = "";
    
    switch(data.column) {
        case "title":
            query = `UPDATE books SET title = ? WHERE book_id = ?`;
            console.log("POST /edit-data:", "Changed title of book to", data.text, "at row", data.id);
            break;
        case "date":
            query = `UPDATE books SET published_date = ? WHERE book_id = ?`;
            console.log("POST /edit-data:", "Changed date of book to", data.text, "at row", data.id);
            break;
        case "page":
            query = `UPDATE books SET page = ? WHERE book_id = ?`;
            console.log("POST /edit-data:", "Changed current page of book to", data.text, "at row", data.id);
            break;
        case "total_pages":
            query = `UPDATE books SET total_pages = ? WHERE book_id = ?`;
            console.log("POST /edit-data:", "Changed totla pages of book to", data.text, "at row", data.id);
            break;
        case "author":

            break;
        case "genre":

            break;
        default:
            res.sendStatus(500);
            return;
    }
    
    let conn;
    try {
        conn = await fetchConn();
        conn.query(query, [data.text, data.id]);

        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(408);
        throw err;
    } finally {
        if (conn) conn.end();
    }
});*/

app.post('/delete-books', async (req, res) => {
    const data = req.body;
    const query = `UPDATE books SET mark_delete = TRUE WHERE id IN (?)`;
    console.log("POST /delete-books:", "Marked book for delete at row", data.ids);

    let conn;
    try {
        conn = await fetchConn();
        conn.query(query, [data.ids]);

        res.sendStatus(200);

    } catch (err) {
        res.sendStatus(408);
        throw err;
    } finally {
        if (conn) conn.end();
    }
});

// Add all genres to the database.
/*var fs = require("fs");
fs.readFile(__dirname + '/public/lists/genres.json', async function(err, data) {
    let genres = JSON.parse(data);
    const query = "INSERT INTO genres (genre_id, genre_name) VALUES (?, ?)";
    let conn;
    try {
        conn = await fetchConn();
        for (let i = 0; i < genres.length; i++) {
            let genre = genres[i];
            conn.query(query, [genre.id, genre.name], function() {
                console.log(genre.id, genre.name);
            });
        }

    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
});*/

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});