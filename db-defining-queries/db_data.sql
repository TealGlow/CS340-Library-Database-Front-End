-- data manipulation queries, corresponding to the features on the library site


-- search operations


-- get all books matching search by title (dropdown menu)
-- matching results will display the book's title, the first & last name of the author, and the book's checked out status
SELECT title, first_name, last_name, on_shelf
FROM Books
JOIN BookAuthors ON BookAuthors.book_id = Books.book_id
JOIN Authors ON Authors.author_id = BookAuthors.author_id
WHERE title = :titleInput;


-- get all books matching search by author (dropdown menu)
-- matching results will display the book's title, the first & last name of the author, and the book's checked out status
SELECT title, first_name, last_name, on_shelf
FROM Books
JOIN BookAuthors ON BookAuthors.book_id = Books.book_id
JOIN Authors ON Authors.author_id = BookAuthors.author_id
WHERE CONCAT(first_name, " ", last_name) = :authorInput;


-- get all books matching search by publisher (dropdown menu)
-- matching results will display the book's title, the first & last name of the author, and the book's checked out status
SELECT title, first_name, last_name, on_shelf
FROM Books
JOIN BookAuthors ON BookAuthors.book_id = Books.book_id
JOIN Authors ON Authors.author_id = BookAuthors.author_id
JOIN Publishers ON Publishers.publisher_id = Books.publisher_id
WHERE company_name = :publisherInput;


-- get all books matching search by section (dropdown menu)
-- matching results will display the book's title, the first & last name of the author, and the book's checked out status
SELECT title, first_name, last_name, on_shelf
FROM Books
JOIN BookAuthors ON BookAuthors.book_id = Books.book_id
JOIN Authors ON Authors.author_id = BookAuthors.author_id
JOIN Sections ON Sections.section_id = Books.section_id
WHERE section_name = :sectionInput;


-- add, update, and delete operations


-- add a new book
INSERT INTO Books(publisher_id, section_id, title, isbn, pages, publication, on_shelf)
VALUES(:pubIDInput, :sectIDInput, :titleInput, :isbnInput, :pagesInput, :pubDateInput, :onShelfInput);


-- update a book
UPDATE Books
SET book_id = :bookIDInput, publisher_id = :pubIDInput, section_id = :sectIDInput, title = :titleInput, isbn=:isbnInput, pages = :pagesInput, publication = :pubDateInput, on_shelf = :onShelfInput
WHERE id=:rowBookId;


-- delete a book
DELETE FROM Books
WHERE book_id=:rowBookID;


-- add a new author
INSERT INTO Authors(first_name, last_name)
VALUES(:firstInput, :lastInput);


-- update an author
UPDATE Authors
SET author_id = :authorIDInput, first_name = :firstInput, last_name = :lastInput
WHERE author_id = :rowAuthorId;


-- delete an author
DELETE FROM Authors
WHERE book_id = :rowAuthorID;


-- add a new section
INSERT INTO Sections(section_name)
VALUES(:sectionNameInput);


-- update a section
UPDATE Sections
SET section_id = :sectionIDInput, section_name = :sectionNameInput
WHERE section_id = :rowSectionID;


-- delete a section
DELETE FROM Sections
WHERE section_id = :rowSectionID;


-- add a new publisher
INSERT INTO Publishers(company_name)
VALUES(:companyNameInput);


-- update a publisher
UPDATE Publishers
SET publisher_id = :pubIDInput, company_name = :pubNameInput
WHERE publisher_id = :rowPubID;


-- delete a publisher
DELETE FROM Publishers
WHERE publisher_id = :rowPubID;


-- add a new patron
INSERT INTO Patrons(first_name, last_name, address, phone)
VALUES(:firstNameInput, :lastNameInput, :addressInput, :phoneInput);


-- update a patron
UPDATE Patrons
SET patron_id = :patronIDInput, first_name = :firstNameInput, last_name = :lastNameInput, address = :addressInput, phone = :phoneInput
WHERE patron_id=rowPatronID;


-- delete a patron
DELETE FROM Patrons
WHERE patron_id = rowPatronID;


-- add a new relationship between Books and Authors
INSERT INTO BookAuthors(book_id, author_id)
VALUES(:bookIDInput, :authorIDInput);


-- udpate a relationship between Books and Authors
UPDATE BookAuthors
SET book_id = :bookIDInput, author_id = :authorIDInput
WHERE book_id = :rowBookID AND author_id = :rowAuthorID;


-- delete at relationship between Books and Authors
DELETE FROM BookAuthors
WHERE book_id = :rowBookId and author_id = :rowAuthorID;


-- add a new relationship between Books and Patrons
INSERT INTO CheckedOutBooks(patron_id, book_id)
VALUES(:patronIDInput, :bookIDInput);


-- update a relationship between Books and Patrons
UPDATE CheckedOutBooks
SET patron_id = :patronIDInput, book_id = :bookIDInput
WHERE patron_id = :rowPatronID AND book_id = :rowBookID;


-- delete a relationship between Books and Patrons
DELETE FROM CheckedOutBooks
WHERE patron_id = :rowPatronID AND book_id = :rowBookID;
