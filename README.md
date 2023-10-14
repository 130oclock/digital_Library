# Digital Library Using Node.js and MariaDB
## A project to learn database management and AJAX in a practical context.
This project is a Node.js digital library that tracks books and reading activity. It uses a MariaDB database to store information about the books such as title, author, genre, and publication date. The website provides a user friendly interface to add, edit, or delete books from the database.

- Create a MariaDB database
- Run a webapp interface to manage the database
- Store details about your favourite books

## Install
- Clone the repository
```bash
$ git clone https://github.com/130oclock/digital_Library
```
- Install dependencies
```bash
cd digital_Library
npm install
```
- Install MariaDB, connect, add a new database, and create a new user
```sql
mariadb -u root -p -h localhost
> CREATE DATABASE <database_name>;
> CREATE USER <username> IDENTIFIED BY <password>;
> GRANT ALL PRIVILEGES ON <database_name> TO <username>;
> FLUSH PRIVILEGES;
> EXIT;
```
- Create a .env according to this [example](#example-env)
- Run the project
```bash
node app.js
```
- Navigate to `http://localhost:3000`

### Example .env

```ini
# Environment variables
IP_ADDRESS  =<ip_address>
LOCALHOST   =127.0.0.1
DEV_PORT    =3000

# DB CONFIG
DB_HOST     ="localhost" # The ip address of the db host
DB_USER     ="<username>"
DB_PASS     ="<password>"
DB_NAME     ="<database_name>"
```