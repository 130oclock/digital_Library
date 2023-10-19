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

const hostname = process.env.PUBLISH ? process.env.IP_ADDRESS : process.env.LOCALHOST;
const port = process.env.DEV_PORT;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/books', async (req, res) => {
    const request = "SELECT * FROM books WHERE mark_delete = FALSE";
    //console.log("GET /books");

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
    const insert = "INSERT INTO books (title, author, genre, date, total_pages) VALUES (?, ?, ?, ?, ?)";
    const data = req.body;
    console.log("POST /add-book:", data.title, data.author, data.genre, data.date, data.pages);

    let conn;
    try {
        conn = await fetchConn();
        await conn.query(insert, [data.title, data.author, data.genre, data.date, data.pages]);
        let newRowID = await conn.query("SELECT LAST_INSERT_ID()");

        res.status(200).send(`{"id":"${parseInt(newRowID[0]['LAST_INSERT_ID()']).toString()}"}`);
    } catch (err) {
        res.sendStatus(408);
        throw err;
    } finally {
        if (conn) conn.end();
    }
});

app.post('/edit-book', async (req, res) => {
    const data = req.body;
    const query = `UPDATE books SET ${data.column} = ? WHERE id = ?`;
    console.log("POST /edit-book:", data.column, data.text, data.id);
    
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
});

app.post('/delete-books', async (req, res) => {
    const data = req.body;
    const query = `UPDATE books SET mark_delete = TRUE WHERE id IN (?)`;
    console.log("POST /delete-books:", data.ids);

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

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});