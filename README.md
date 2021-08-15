# Books API


## What does it do?

The books api allows you to to add books to the database and categorize them by author.

## Getting started

You can run this api localy by cloning the repository and using Docker. For more information regarding Docker, please refer to [the Docker documentation](https://docs.docker.com/).

Navigate to the root folder and boot up the Docker container using the following commands. 

    
    docker-compose build
    docker-compose up
    

You can run test by navigating to the api folder and using:

    
    npm test
   

## Endpoints

Use the following endpoints to create, read, update or delete objects int the authors and book table.

### authors

`GET /authors`
    - Returns all authors from the database.

`GET /author/:uuid`
    - Returns specific author from the database.

`POST /addAuthor`
    - Creates a new author in the database.

`DELETE /deleteAuthor`
    - Searches the database for the author with the given uuid and deletes it along with all the books attached to it.

`PATCH /updateAuthor/:uuid`
    - Searches the database for the author with the given uuid and updates the content.
### book

`GET /books`
    - Returns all books from the database.

`GET /book/:uuid`
    - Returns specific book from the database.

`POST /addBook`
    - Creates a new book in the database.

`DELETE /deleteBook`
    - Searches the database for the book with the given uuid and deletes it.

`PATCH /updateBook/:uuid`
    - Searches the database for the book with the given uuid and updates the content.

## Project Status

This project is in development.

## Authors

Jan-Baptist De Bondt
## License
[MIT](https://choosealicense.com/licenses/mit/)