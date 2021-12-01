# Library Database Front-end
Team name: Team Syntax Error

Group number: 48

Group members: Alyssa Comstock, Colin Joss

Class: CS340 - Introduction to Databases

School: Oregon State University

Late Update: 11/30/2021

Description: Full-stack website that handles the front-end and back-end that
interacts with a database.  This database is a relational database that we set
up during the fall term of 2021.


## Table of contents:

- [Project Description](#Library-Database-Front-end)
- [About this website](#About-This-Website)
- [How to use Website](#How-to-use-Website)
- [How to set up the Database](#How-to-set-up-the-Database)
- [Database Overview](#Database-Overview)
- [Database Outline](#Database-Outline)
- [Entity-Relationship Diagram](#Entity-Relationship-Diagram)
- [Schema](#Schema)

## About This Website:

Simple Library website that contains a page for each table.  Follows the CRUD operations on each table.  So, each page allows the user to Create, Read, Update, and Delete for each table in the database.

Built in a Node.js / Express server using EJS for templating.


## How to use Website:
- Download the repo and place it in the directory you wish to work in.
- Create a .env file in the same directory as app.js and dbcon.js and place the credentials of the MySQL database into it.  You need to have your database set up like ours.
  - Your .env should look like:
    ```
    CONNECTIONLIMIT=10
    HOST=host_name_here
    USER=username_here
    PASSWORD=password_here
    DATABASE=database_name_here
    ```
- Run the command ```npm install``` to download all the node modules needed.
- Run the command ```node app.js```
- Go to the localhost on the port that is specified when the app is run.


## How to set up the Database:

Run all the queries contained in [db-defining-queries/db_defining.sql](https://github.com/TealGlow/CS340-Library-Database-Front-End/blob/master/db-defining-queries/db_defining.sql)


## Database Overview:
A new library is opening up in your town. This library will hold thousands of books by thousands of authors. These books will be printed by many different publishers and they will be organized in many discrete sections of the library according to their genre. A large portion of the population of your town will frequent this library to check out and return books. An operation such as this requires a database to keep track of a lot of information. Patrons will want to know if the library has a certain book on the shelf and then find that book in the proper section. The library will need a system in place for managing their inventory and tracking who has which books.

This is a medium-sized library and the database should be able to handle a collection of 200,000 books. Suppose your town has an adult population of 150,000; the library will therefore need to handle up to 150,000 registered library patrons. Examples of information that can be accessed through database queries include: Does a specific book exist at the library? How many books by a given author are available? Is a given book on the shelf or checked out?


## Database Outline:
### Books - contains details about the library books.
- book_id         int   not NULL   unique   auto_increment   PK
- publisher_id        int   not NULL   FK
- section_id         int   not NULL   FK
- title            varchar   not NULL
- isbn             int   not NULL
- pages         int   not NULL
- publication         date/time   not NULL
- on_shelf        bool   not NULL

#### Relationships: 
- M:M Relationship to Authors using BookAuthors as an intersection.
- 1:M Relationship between Books and BookAuthors using the book_id as a foreign key in the BookAuthors table.
- M:1 Relationship to Publishers. Using publisher_id as a foreign key.
- M:1 Relationship to Sections. Using section_id as a foreign key.
- M:M Relationship with Patrons 
- 1:M relationship between Books and CheckedOutBooks as an intersection table.

### Authors - contains details about the authors of the library books.
- author_id        int   not NULL   unique   auto_increment   PK
- first_name         varchar   not NULL
- last_name        varchar   not NULL

#### Relationships:
- M:M Relationship between Authors and Books using BookAuthors as an intersection.
- 1:M Relationship between Authors and BookAuthors using author_id as a foreign key in the BookAuthors table.

### BookAuthors - intersection between Books and Authors.
- author_id        int   not NULL   FK
- book_id        int   not NULL   FK

#### Relationships:
- M:1 Relationship between BookAuthors and Authors using author_id as a foreign key in the BookAuthors table.
- M:1 Relationship between BookAuthors and Books table using book_id as a foreign id in the BookAuthors table.

### Publishers - contains details about publishers of library books.
- publisher_id        int   not NULL   unique   auto_increment   PK
- company_name     varchar   not NULL

#### Relationships:
- 1:M Relationship between Publishers and Books using publisher_id as a foreign key in the Books table.


### Sections - contains details about the section library books are kept in.
- section_id        int   not NULL   unique   auto_increment   PK
- section_name    varchar   not NULL

#### Relationships:
- 1:M Relationship between Sections and Books using section_id as a foreign key in the Books table.

### Patrons - contains details about library customers.
- patron_id        int   not NULL   unique   auto_increment   PK
- first_name        varchar   not NULL
- last_name        varchar   not NULL
- address        varchar   not NULL
- phone         varchar   not NULL

#### Relationships:
- M:M relationship between Patrons and Books using CheckedOutBooks as an intersection table.
- 1:M relationship with CheckedOutBooks intersection table.    

### CheckedOutBooks - intersection between Books and Patrons
- patron_id         int   not NULL   FK
- book_id        int   not NULL   FK

#### Relationships:
- M:1 Relationship with Patrons using patron_id as a foreign key from Patrons.
- M:1 relationship with Books using book_id as a foreign key from Books.


## Entity-Relationship Diagram:
![ERD](https://github.com/TealGlow/Library-Database-Front-End/blob/master/digrams/Intro%20to%20databases%20-%20project%20draft%20-%20Page%201(6).png)

## Schema:
![Schema](https://github.com/TealGlow/Library-Database-Front-End/blob/master/digrams/Intro%20to%20databases%20-%20project%20draft%20-%20Page%202(10).png)
