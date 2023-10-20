# Digital Library Using Node.js and MariaDB
## A project to learn database management and AJAX in a practical context.
This project is a Node.js digital library that tracks books and reading activity. It uses a MariaDB database to store information about the books such as title, author, genre, and publication date. The website provides a user friendly interface to add, edit, or delete books from the database.

- Create a MariaDB database
- Run a webapp interface to manage the database
- Store details about your favourite books

### Features

- Add books
- Edit books
- Delete books
- Select multiple books for deletion
- Search books by title, author, genre...
- Track number of pages read in each book

### TODO

- Add a heat map for reading progress
- Add more style
- Add dark mode
- Add json export feature
- Add genre enumeration
- Change to relational database
- Add table of authors
- Add table of genres
- Add table of book series

- Create a new page for adding books instead of a popup form
- Create a page for each row which can be used to edit
- Add button to mark selection of books as completed
    - Set the page to the total pages for each book

## Install
- Clone the repository
```bash
git clone https://github.com/130oclock/digital_Library
```
- Install dependencies
```bash
cd digital_Library
npm install
```
- Install and connect to MariaDB
- Add a new database and create a new user
```
CREATE DATABASE <database_name>;
CREATE USER <username> IDENTIFIED BY <password>;
GRANT ALL PRIVILEGES ON <database_name> TO <username>;
FLUSH PRIVILEGES;
EXIT;
```
- Create a .env according to this [example](#example-env)
- Run the project
```bash
node app.js
```
- Navigate to `http://localhost:3000`

## Example .env

```ini
# Environment variables
IP_ADDRESS  =<ip_address>
LOCALHOST   =127.0.0.1
DEV_PORT    =3000

PUBLISH     =false # false : host at localhost only
                   # true  : host at the computer's ip address

# DB CONFIG
DB_HOST     ="localhost" # The ip address of the db host
DB_USER     ="<username>"
DB_PASS     ="<password>"
DB_NAME     ="<database_name>"
```