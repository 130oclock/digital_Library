require('dotenv').config();
const express = require('express');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 2
});
async function asyncFunction() {
    let conn;
    try {
        conn = await pool.getConnection();
        // Print connection thread
        console.log(`Connected! (id=${conn.threadId})`);

    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

const connection = asyncFunction();

const app = express();

const hostname = process.env.LOCALHOST;
const port = process.env.DEV_PORT;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});