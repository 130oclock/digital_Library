require('dotenv').config();
const express = require('express');
const mariadb = require('mariadb');
const app = express();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 2
});

console.log('Active connections: ', pool.activeConnections());

async function fetchConn() {
    let conn = await pool.getConnection();
    return conn;
}

const hostname = process.env.LOCALHOST;
const port = process.env.DEV_PORT;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/books', async (req, res) => {
    const request = "SELECT * FROM books";

    let conn;
    try {
        conn = await fetchConn();
        // console.log('Active connections: ', pool.activeConnections());
        const rows = await conn.query(request);

        res.status(200).send(rows);

    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
});

app.get('/add-book', (req, res) => {

});

app.post('/add-book', async (req, res) => {
    const insert = "INSERT INTO books (title, author, genre, date) VALUES (?, ?, ?, ?)";
    const data = req.body;
    console.log("POST request for:", data.title, data.author, data.genre, data.date);

    let conn;
    try {
        conn = await fetchConn();
        // console.log('Active connections: ', pool.activeConnections());
        await conn.query(insert, [data.title, data.author, data.genre, data.date]);

        res.status(200).redirect('/');
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});