
-- INITIAL DEFINITION OF tables
-- NOTE: I HAVE THE FKS AS CAN BE NULL IN THE TABLES SO That
-- ON DELETE THEY GET SET AS NULL


-- define Authors table:
CREATE TABLE IF NOT EXISTS Authors(
  author_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);


-- Define Patrons table:
CREATE TABLE IF NOT EXISTS Patrons(
  patron_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL
);


-- Define sections table:
CREATE TABLE IF NOT EXISTS Sections(
  section_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  section_name VARCHAR(255) NOT NULL
);


-- Define Publishers table:
CREATE TABLE IF NOT EXISTS Publishers(
  publisher_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  company_name varchar(255) NOT NULL
);


-- Define CheckedOutBooks
CREATE TABLE IF NOT EXISTS CheckedOutBooks(
  patron_id INT,
  book_id INT
);


-- Define BookAuthors
CREATE TABLE IF NOT EXISTS BookAuthors(
  author_id INT,
  book_id INT
);


-- define Books table
CREATE TABLE IF NOT EXISTS Books (
  book_id INT AUTO_INCREMENT PRIMARY KEY,
  isbn varchar(255) NOT NULL,
  title varchar(255) NOT NULL,
  pages INT NOT NULL,
  publication DATE NOT NULL,
  publisher_id INT,
  section_id INT,
  on_shelf BOOLEAN NOT NULL DEFAULT 0 -- setting default to false
);


-- Add foreign key constraint on tables


-- NOTE: I have the FKS in the tables defined above as can be NULL so that on DELETE
-- they are set to NULL, but I don't know if thats what we should do.


-- BookAuthors FKs
ALTER TABLE BookAuthors
  ADD FOREIGN KEY (`author_id`) REFERENCES `Authors`(`author_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD FOREIGN KEY (`book_id`) REFERENCES `Books`(`book_id`) ON DELETE CASCADE ON UPDATE CASCADE;


-- CheckedOutBooks FKs
ALTER TABLE CheckedOutBooks
  ADD FOREIGN KEY (`patron_id`) REFERENCES `Patrons`(`patron_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD FOREIGN KEY (`book_id`) REFERENCES `Books`(`book_id`) ON DELETE CASCADE ON UPDATE CASCADE;


-- Books FKs
ALTER TABLE Books
  ADD FOREIGN KEY (`publisher_id`) REFERENCES `Publishers`(`publisher_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD FOREIGN KEY (`section_id`) REFERENCES `Sections`(`section_id`) ON DELETE CASCADE ON UPDATE CASCADE;


  -- Add sample data


  -- Books:
INSERT INTO Books(isbn, title, pages, publication, on_shelf) VALUES ("9780062060624", "The Song of Achilles", 416, '2011-09-20', 1);
INSERT INTO Books(isbn, title, pages, publication, on_shelf) VALUES ("9781400031702", "The Secret History", 544, '1992-09-01', 1);
INSERT INTO Books(isbn, title, pages, publication, on_shelf) VALUES ("9780618640157", "The Lord of the Rings (50th Anniversary Edition)", 1184, '2004-10-10', 1);


-- Sections:
INSERT INTO Sections (section_name) VALUES("Fiction");
INSERT INTO Sections (section_name) Values("Science");
INSERT INTO Sections (section_name) Values("History");


-- Publishers:
INSERT INTO Publishers (company_name) VALUES ("Penguin Books USA");
INSERT INTO Publishers (company_name) VALUES ("Avery");
INSERT INTO Publishers (company_name) VALUES ("Berkley");


-- Patrons:
INSERT INTO Patrons (first_name, last_name, address, phone) VALUES ("Jane", "Doe", "3740 Perry Street", "8106586053");
INSERT INTO Patrons (first_name, last_name, address, phone) VALUES ("Joshua", "Beaver", "4873 Harter Street", "9376285683");
INSERT INTO Patrons (first_name, last_name, address, phone) VALUES ("Verna", "East", "3179 Lochmere Lane", "8604523318");


-- Authors:
INSERT INTO Authors (first_name, last_name) VALUES ("Donna", "Tartt");
INSERT INTO Authors (first_name, last_name) VALUES ("Madeline", "Miller");
INSERT INTO Authors (first_name, last_name) VALUES ("J.R.R.", "Tolkien");


-- Book Authors:
INSERT INTO BookAuthors (author_id, book_id) VALUES (1, 2);
INSERT INTO BookAuthors (author_id, book_id) VALUES (2, 1);
INSERT INTO BookAuthors (author_id, book_id) VALUES (3, 3);


-- setting section and publisher_id on books:
UPDATE Books SET publisher_id=1 WHERE book_id=1;
UPDATE Books SET publisher_id=3 WHERE book_id=2;
UPDATE Books SET publisher_id=3 WHERE book_id=3;

UPDATE Books SET section_id=2 WHERE book_id=1;
UPDATE Books SET section_id=3 WHERE book_id=2;
UPDATE Books SET section_id=1 WHERE book_id=3;


-- Setting checked out books for patrons:
INSERT INTO CheckedOutBooks (patron_id, book_id) VALUES (1,3);
INSERT INTO CheckedOutBooks (patron_id, book_id) VALUES (1,2);
INSERT INTO CheckedOutBooks (patron_id, book_id) VALUES (3,3);
