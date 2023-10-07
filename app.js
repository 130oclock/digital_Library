require('dotenv').config();
const express = require('express');
const app = express();

const hostname = process.env.LOCALHOST;
const port = process.env.DEV_PORT;


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});