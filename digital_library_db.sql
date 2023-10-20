CREATE DATABASE digital_library_db;

Use digital_library_db;

CREATE TABLE books(
    book_id         SMALLINT NOT NULL AUTO_INCREMENT,
    title           VARCHAR(255) NOT NULL,
    total_pages     SMALLINT NOT NULL DEFAULT 0,
    page            SMALLINT NOT NULL DEFAULT 0,
    published_date  DATE,
    mark_delete     BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY(book_id)
);

CREATE TABLE authors(
    author_id       SMALLINT NOT NULL AUTO_INCREMENT,
    first_name      VARCHAR(100) NOT NULL,
    middle_name     VARCHAR(50) NULL,
    last_name       VARCHAR(100) NULL,
    PRIMARY KEY(author_id)
);

CREATE TABLE book_authors(
    book_id         SMALLINT NOT NULL,
    author_id       SMALLINT NOT NULL,
    FOREIGN KEY(book_id) 
        REFERENCES books(book_id)
        ON DELETE CASCADE,
    FOREIGN KEY(author_id) 
        REFERENCES authors(author_id)
        ON DELETE CASCADE
);

CREATE TABLE genres(
    genre_id        SMALLINT NOT NULL AUTO_INCREMENT,
    genre_name      VARCHAR(100) NOT NULL,
    parent_id       SMALLINT,
    PRIMARY KEY(genre_id)
);

CREATE TABLE book_genres(
    book_id         SMALLINT NOT NULL,
    genre_id        SMALLINT NOT NULL,
    FOREIGN KEY(book_id) 
        REFERENCES books(book_id)
        ON DELETE CASCADE,
    FOREIGN KEY(genre_id) 
        REFERENCES genres(genre_id)
        ON DELETE CASCADE
);