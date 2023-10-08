CREATE DATABASE digital_library_db;

Use digital_library_db;

CREATE TABLE books (
    id SMALLINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255),
    author VARCHAR(255),
    genre VARCHAR(255),
    date DATE, -- YYYY-MM-DD
    PRIMARY KEY (id)
);