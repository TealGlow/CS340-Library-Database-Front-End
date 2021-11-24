const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require('./dbcon.js');

const app = express();

// IMPORTANT: change the port to whatever works the best on the flip server.
const PORT = 8632;


// set up ejs as the view engine
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

/*
  MYSQL portion
*/
app.set('mysql', mysql);

/*
  Queries
*/
var tableName = "";
var idName="";


// select query
const selectQuery = selectQ`SELECT * FROM ${tableName};`; // use this for all tables

// insert queries
const insertBooksQuery = `INSERT INTO Books (isbn, title, pages, publication, publisher_id, section_id, on_shelf) VALUES (?,?,?,?,?,?,?);`;
const insertPatronsQuery = `INSERT INTO Patrons (first_name, last_name, address, phone) VALUES (?,?,?,?);`;
const insertAuthorsQuery = `INSERT INTO Authors(first_name, last_name) VALUES(?, ?);`;
const insertSectionsQuery = `INSERT INTO Sections(section_name) VALUES(?);`;
const insertPublishersQuery = `INSERT INTO Publishers (company_name) VALUES (?);`;
const insertCheckedOutBooksQuery = `INSERT INTO CheckedOutBooks(patron_id, book_id) VALUES (?,?);`;
const insertBookAuthorQuery =  `INSERT INTO BookAuthors(author_id, book_id) VALUES(?,?);`;


// update queries
const modifyBooksQuery = `UPDATE Books SET isbn=?, title=?, pages=?, publication=?, publisher_id=?, section_id=?, on_shelf=? WHERE book_id=?`;
const modifyCheckedOutBooks = `UPDATE CheckedOutBooks SET patron_id=?, book_id=? WHERE (patron_id = ? AND Book_id=?);`;
const modifyBookAuthors = `UPDATE BookAuthors SET author_id=?, book_id=? WHERE(author_id=? AND book_id=?);`;
const modifyPublishersQuery = `UPDATE Publishers SET company_name=? WHERE publisher_id=?;`;
const modifyPatronsQuery = `UPDATE Patrons SET first_name=?, last_name=?, address=?, phone=? WHERE patron_id=?;`;
const modifySectionsQuery = `UPDATE Sections SET section_name=? WHERE section_id=?;`;
const modifyAuthorsQuery = `UPDATE Authors SET first_name=?, last_name=? WHERE author_id=?;`;



// delete Queries
const deleteQuery = `DELETE FROM ${tableName} WHERE book_id=${idName};`;
const deleteBookAuthors = `DELETE FROM BookAuthors WHERE author_id=? AND book_id=?;`;
const deleteCheckedOutBooksQuery = `DELETE FROM CheckedOutBooks WHERE patron_id=? AND book_id=?;`;


// search queries
function searchTitleQ(title) {
    return `SELECT title, first_name, last_name
            FROM Books
            JOIN BookAuthors ON BookAuthors.book_id = Books.book_id
            JOIN Authors ON Authors.author_id = BookAuthors.author_id
            WHERE title = ${title};`;
}


const searchById = `SELECT * FROM ${tableName} WHERE ${idName}=?`;
const searchCheckedOutBooks = `SELECT * FROM CheckedOutBooks WHERE patron_id=? AND book_id=?;`;
const searchBookAuthors = `SELECT * FROM BookAuthors WHERE author_id=? AND book_id=?;`;


function searchAuthorQ(author) {
    return `SELECT title, first_name, last_name, on_shelf
            FROM Books
            JOIN BookAuthors ON BookAuthors.book_id = Books.book_id
            JOIN Authors ON Authors.author_id = BookAuthors.author_id
            WHERE CONCAT(first_name, " ", last_name) = ${author};`;
}



function searchPublisherQ(publisher) {
    return `SELECT title, first_name, last_name, on_shelf
            FROM Books
            JOIN BookAuthors ON BookAuthors.book_id = Books.book_id
            JOIN Authors ON Authors.author_id = BookAuthors.author_id
            JOIN Publishers ON Publishers.publisher_id = Books.publisher_id
            WHERE company_name = ${publisher};`;
}



function searchSectionQ(section) {
    return `SELECT title, first_name, last_name, on_shelf
            FROM Books
            JOIN BookAuthors ON BookAuthors.book_id = Books.book_id
            JOIN Authors ON Authors.author_id = BookAuthors.author_id
            JOIN Sections ON Sections.section_id = Books.section_id
            WHERE section_name = ${section};`;
}



function selectQ(tblName){
  // template selectQuery
  return  `SELECT * FROM ${tblName};`;
};



function setSearchByIdNameAndId(tblName, idName){
  // template search by id query.
  return `SELECT * FROM ${tblName} WHERE ${idName}=?;`;
};



function setDeleteQuery(tblName, idName){
  return `DELETE FROM ${tblName} WHERE ${idName}=?;`;
};



const getSectionIds = async function (p){
  const results = await mysql.pool.query(`SELECT section_id FROM Sections;`);
  console.log(results);
  p.resolve(results);
}



/*
    FUNCTIONS TO HANDLE THE MAIN PAGE OF THE WEBSITE
    when user goes to the path "/" they will be redirected to the path
    "/index.html" as the rubric states.

    Index.ejs sends the user to the page that shows all the pages the WEBSITE
    will have and a short description.
*/
app.get("/", (req, res)=>{
  // main page this will redirect them to index.html path
  res.redirect("/index.html");
});



app.get("/index.html", (req, res)=>{
  // main page for now just shows the different pages we can go to.
  // I did this since I was using node.js and ejs for templating
  // I know in the rubric they wanted the main page to be index.html
  var data={
    error:""
  }
  res.render("pages/index.ejs", {data:data});
});



app.post("/index.html", (req, res) => {
    console.log(req.body);
});



/*
      BOOKS TABLE
*/
app.get("/booksTable.html", (req, res)=>{

    // shows all the data in the books table

    mysql.pool.query(selectQ("Books"), (err, rows, fields)=>{
      // get the books table!
      if(err){
        // if there was an error, throw the error
        console.error(err);
        res.render("pages/booksTable.ejs", {data:"", error:"Error getting table data"});
      }else{
        // else do something with the data
        res.render("pages/booksTable.ejs", {data:rows, error:""});
      }
    });
});

/*
add
*/
app.post("/booksTable", (req, res)=>{
  if(!req.body){
    console.error("No req body");
    res.sendStatus(204);
  }else{

    /*var bid = req.body.book_id;*/
    var isb = req.body.isbn;
    var ti = req.body.title;
    var pa = req.body.pages;
    var pub = req.body.publication;
    var pid = req.body.publisher_id;
    var sid = req.body.section_id;
    var ons = req.body.on_shelf;

    // validation of the POST request data.
    mysql.pool.query(insertBooksQuery, [isb, ti, pa, pub, pid, sid, ons], (err, result)=>{
      if(err){
        console.error(err);
        res.sendStatus(400);
      }else{
        // successfully added new item
        res.redirect("/booksTable.html");
      }
    });

  }

});


/*
update
*/

app.put("/booksTable", (req,res)=>{
  // updates the item if there was a change
  if(!req.body){
    console.error("No req body");
    res.sendStatus(204);
  }else{
    mysql.pool.query(setSearchByIdNameAndId("Books", "book_id"), [req.body.book_id || req.query.book_id], (err, result)=>{
      if(err){
        res.sendStatus(400);
      }else{
        // update items where
        if(result.length == 1){
          var tempCurrentValues = result[0];
          // query the db to change items if they changed at all! else keep the current values
          mysql.pool.query(modifyBooksQuery, [
            req.body.isbn || req.query.isbn || tempCurrentValues.isbn,
            req.body.title || req.query.title || tempCurrentValues.title,
            req.body.pages || req.query.pages || tempCurrentValues.pages,
            req.body.publication || req.query.publication || tempCurrentValues.publication,
            parseInt(req.body.publisher_id) || parseInt(req.query.publisher_id) || parseInt(tempCurrentValues.publisher_id),
            parseInt(req.body.section_id) || parseInt(req.query.section_id) || parseInt(tempCurrentValues.section_id),
            parseInt(req.body.on_shelf),
            req.body.book_id || req.query.book_id], (err, result)=>{
            // update here
            if(err){
              console.error(err);
              res.sendStatus(400);
            }else{
              console.log("updated!");
              res.sendStatus(200);
            }
          });
        }
      }
    });
  }
});


/*
delete
*/

app.delete("/booksTable", (req, res)=>{
  if(!req.body){
    console.error("No req body");
    res.sendStatus(204);
  }else{
    mysql.pool.query(setSearchByIdNameAndId("Books", "book_id"), [req.body.id || req.query.id], (err, result)=>{
      if(err){
        console.error("Error deleting row");
        res.sendStatus(403);
      }else{
        if(result.length == 1){
          mysql.pool.query(setDeleteQuery("Books", "book_id"), [req.body.id || req.query.id], (err, result)=>{
            if(err){
              res.sendStatus(403);
              console.error("Error deleting");
            }else{
              // success
              res.sendStatus(200);
            }
          });
        }
      }
    });
  }

});


/*
    PATRONS TABLE FUNCTIONS - HANDLES THE ADDITION, MODIFICATION, AND DELETION
    OF A PATRON FROM THE TABLE.
*/

app.get("/patronsTable.html", (req, res)=>{

  mysql.pool.query(selectQ("Patrons"), (err, rows, fields)=>{
    // get the patrons table
    if(err){
      // if there was an error, throw the error
      console.error(err);
      res.render("pages/patronsTable.ejs", {data:"", error:"Error getting table data"});
    }else{
      // else do something with the data
      res.render("pages/patronsTable.ejs", {data:rows, error:""});
    }
  });

});



app.post("/patronsTable", (req, res)=>{
  // CLEAN ALL SPECIAL CHARACTERS FROM ALL USER INPUTS!

  if(!req.body){
    console.error("No req body");
    res.sendStatus(204);
  }else{
    var fn = removeSpecialCharacters(req.body.first_name);
    var ln = removeSpecialCharacters(req.body.last_name);
    var add = req.body.address;
    var ph =  req.body.phone;

    // validation of the POST request data.

    if(!fn || !ln || !add | !ph){
      // user did not enter an item, give them an error and do not add the DATA
      res.render("pages/patronsTable.ejs", {data:tempPatronsData, error:"Please enter all data fields."})
    }else{
      mysql.pool.query(insertPatronsQuery, [fn, ln, add, ph], (err, result)=>{
        if(err){
          console.error(err);
          res.sendStatus(400);
        }else{
          // successfully added new item
          console.log("success");
          // redirect to page to show data.
          res.redirect("/patronsTable.html");
        }
      });

    }
  }
});



app.put("/patronsTable", (req,res)=>{
  if(!req.body){
    console.error("No req body");
    res.sendStatus(204);
  }else{
    mysql.pool.query(setSearchByIdNameAndId("Patrons", "patron_id"),  [req.body.patron_id || req.query.patron_id], (err, rows)=>{
      console.log("rows",rows);
      if(!err){
        // modify query
        mysql.pool.query(modifyPatronsQuery, [
              req.body.first_name||req.query.first_name || rows[0].first_name,
              req.body.last_name || req.query.last_name || rows[0].last_name,
              req.body.address || req.query.address || rows[0].address,
              req.body.phone || req.query.phone || rows[0].phone,
              parseInt(req.body.patron_id)
            ],
            (err, result)=>{
          if(err){
            console.error("Error updating Patrons");
            res.sendStatus(400);
            return;
          }
          // successfully found and modified row.
          console.log("success", result);
          res.sendStatus(200);
        });
      }
    });

  }
});



app.delete("/patronsTable", (req, res)=>{

  if(!req.body){
    console.error("No req body");
    res.sendStatus(204);
  }else{
    // search for the row
    mysql.pool.query(setSearchByIdNameAndId("Patrons", "patron_id"), [req.body.id || req.query.id], (err, result)=>{
      if(err){
        // error finding row
        console.error("Error deleting row");
        res.sendStatus(403);
        return;
      }else{
        if(result.length == 1){
          // delete row from the table
          mysql.pool.query(setDeleteQuery("Patrons", "patron_id"), [req.body.id || req.query.id], (err, result)=>{
            if(err){
              console.error("Error deleting");
              res.sendStatus(403);
            }else{
              // delete happened
              console.log("Deleted!");
              res.sendStatus(200);
            }
          });
        }
      }
    });
  }

});



/*
   FUNCTIONS TO HANDLE THE SECTIONS TABLE, ALLOW FOR THE ADDITION, REMOVAL, AND
   MODIFICATION OF THE SECTIONS TABLE.
*/


app.get("/sectionsTable.html", (req,res)=>{
    // shows all the data in the sections table
    mysql.pool.query(selectQ("Sections"), (err, rows, fields) => {
        // get the authors table!
        if (err) {
            // if there was an error, throw the error
            console.error(err);
            res.render("pages/sectionsTable.ejs", { data: "", error: "Error getting table data" });
        } else {
            // else do something with the data
            console.log(rows);
            res.render("pages/sectionsTable.ejs", { data: rows, error: "" });
        }
    });
});



app.post("/sectionsTable", (req, res) => {
    if (!req.body) {
        console.error("No req body");
        res.sendStatus(204);
    } else {
        var name = req.body.section_name;

        // validation of the POST request data.
        mysql.pool.query(insertSectionsQuery, [name], (err, result) => {
            if (err) {
                console.error(err);
                res.sendStatus(400);
            } else {
                // successfully added new item
                console.log("success");
                // redirect to page to show data.
                res.redirect("/sectionsTable.html");
            }
        });

    }

});



app.put("/sectionsTable", (req, res)=>{
  if(!req.body){
    console.error("No req body");
    res.sendStatus(204);
  }else{
    mysql.pool.query(setSearchByIdNameAndId("Sections", "section_id"),  [req.query.section_id], (err, rows)=>{
      if(!err){
        // modify query
        mysql.pool.query(modifySectionsQuery, [req.body.section_name|| rows[0].section_name, parseInt(req.body.section_id)], (err, result)=>{
          if(err){
            console.error("Error updating Sections");
            res.sendStatus(400);
          }else{
            // successfully found and modified row.
            console.log("success", result);
            res.sendStatus(200);
          }

        });
      }
    });

  }
});


// check this since the sections table doesnt display yet
app.delete("/sectionsTable", (req, res)=>{
  if(!req.body){
    console.error("No req body");
    res.sendStatus(204);
  }else{
    mysql.pool.query(setSearchByIdNameAndId("Sections", "section_id"), [req.body.id || req.query.id], (err, result)=>{
      if(err){
        console.error("Error deleting row");
        res.sendStatus(403);
        return;
      }else{
        if(result.length == 1){
          mysql.pool.query(setDeleteQuery("Sections", "section_id"), [req.body.id || req.query.id], (err, result)=>{
            if(err){
              console.error("Error deleting");
              res.sendStatus(403);
            }else{
              console.log("Deleted!");
              res.sendStatus(200);
            }
          });
        }
      }
    });
  }

});



/*

  FUNCTIONS FOR THE PUBLISHERS TABLE -- ALLOWS FOR THE ADDITION, REMOVAL, AND
  MODIFICATION OF THE PUBLISHERS TABLE.

*/


app.get("/publishersTable.html", (req, res)=>{

  // shows all the data in the books table

  mysql.pool.query(selectQ("Publishers"), (err, rows, fields)=>{
    // get the books table!
    if(err){
      // if there was an error, throw the error
      console.error(err);
      res.render("pages/publishersTabl.ejs", {data:"", error:"Error getting table data"});
    }else{
      // else do something with the data
      console.log(rows);
      res.render("pages/publishersTable.ejs", {data:rows, error:""});
    }
  });

});



app.post("/publishersTable", (req, res)=>{
  console.log("Publishers POST", req.body);

  // CLEAN ALL SPECIAL CHARACTERS FROM ALL USER INPUTS!

  if(!req.body){
    console.error("No req body");
    req.sendStatus(204);
  }else{
    /*var pid = parseInt(req.body.publisher_id);*/
    var cn = req.body.company_name;

    var context={};
    // validation of the POST request data.
    mysql.pool.query(insertPublishersQuery , [cn], (err, result)=>{
      if(err){
        console.error(err);
        res.sendStatus(400);
      }else{
        // successfully added new item
        console.log("success");
        // redirect to page to show data.
        res.redirect("/publishersTable.html");
      }
    });

  };
});



app.put("/publishersTable", (req, res)=>{

  if(!req.body){
    console.error("No req body");
    res.sendStatus(204);
  }else{
    mysql.pool.query(setSearchByIdNameAndId("Publishers", "publisher_id"),  [req.body.publisher_id || req.query.publisher_id], (err, rows)=>{
      if(!err){
        // modify query
        mysql.pool.query(modifyPublishersQuery, [req.body.company_name|| rows[0].company_name, parseInt(req.body.publisher_id) || parseInt(req.query.publisher_id)], (err, result)=>{
          if(err){
            console.error("Error updating publihsers");
            res.sendStatus(400);
          }else{
            // successfully found and modified row.
            console.log("success", result);
            res.sendStatus(200);
          }

        });
      }
    });

  }
});



app.delete("/publishersTable", (req, res)=>{

  if(!req.body){
    console.error("Nothing to delete");
    req.sendStatus(204);
  }else{
    // search for the row
    mysql.pool.query(setSearchByIdNameAndId("Publishers", "publisher_id"), [req.body.id || req.query.id], (err, result)=>{
      if(err){
        // error finding row
        console.error("Error deleting row");
        res.sendStatus(403);
      }else{
        if(result.length == 1){
          // delete row from the table
          mysql.pool.query(setDeleteQuery("Publishers", "publisher_id"), [req.body.id || req.query.id], (err, result)=>{
            if(err){
              console.error("Error deleting");
              res.sendStatus(403);
            }else{
              // delete happened
              console.log("Deleted!");
              res.sendStatus(200);
            }
          });
        }
      }
    });
  }

});


/*

  FUNCTIONS TO HANDLE THE AUTHORS TABLE.

*/

// Display all data in table
app.get("/authorsTable.html", (req, res) => {
    // shows all the data in the books table
    console.log(selectQ("Authors"));

    mysql.pool.query(selectQ("Authors"), (err, rows, fields) => {
        // get the authors table!
        if (err) {
            // if there was an error, throw the error
            console.error(err);
            res.render("pages/authorsTable.ejs", { data: "", error: "Error getting table data" });
        } else {
            // else do something with the data
            console.log(rows);
            res.render("pages/authorsTable.ejs", { data: rows, error: "" });
        }
    });
});


// Insert new item into table
app.post("/authorsTable", (req, res) => {
    if (!req.body) {
        console.error("No req body");
        req.sendStatus(204);
    } else {
        var fn = req.body.first_name;
        var ln = req.body.last_name

        var context = {};
        // validation of the POST request data.
        mysql.pool.query(insertAuthorsQuery, [fn, ln], (err, result) => {
            if (err) {
                console.error(err);
                res.sendStatus(400);
            } else {
                // successfully added new item
                console.log("success");
                // redirect to page to show data.
                res.redirect("/authorsTable.html");
            }
        });

    }
});



app.put("/authorsTable", (req, res)=>{

  if(!req.body){
    console.error("No req body");
    req.sendStatus(204);
  }else{
    mysql.pool.query(setSearchByIdNameAndId("Authors", "author_id"),  [req.body.author_id || req.query.author_id], (err, rows)=>{
      if(!err){
        // modify query
        mysql.pool.query(modifyAuthorsQuery, [req.body.first_name|| rows[0].first_name || req.query.first_name, req.body.last_name || req.query.last_name || rows[0].last_name, parseInt(req.body.author_id)||parseInt(req.query.author_id)], (err, result)=>{
          if(err){

            console.error("Error updating Authors");
            res.sendStatus(400);
          }else{
            // successfully found and modified row.
            console.log("success", result);
            res.sendStatus(200);
          }

        });
      }
    });

  }

});



app.delete("/authorsTable", (req, res)=>{
  // search for the row
  if(!req.body){
    console.error("No req body");
    req.sendStatus(204);
  }else{
    mysql.pool.query(setSearchByIdNameAndId("Authors", "author_id"), [req.body.id || req.query.id], (err, result)=>{
      if(err){
        // error finding row
        console.error("Error deleting row");
        res.sendStatus(403);
      }else{
        if(result.length == 1){
          // delete row from the table
          mysql.pool.query(setDeleteQuery("Authors", "author_id"), [req.body.id || req.query.id], (err, result)=>{
            if(err){
              console.error("Error deleting");
              res.sendStatus(403);
            }else{
              // delete happened
              console.log("Deleted!");
              res.sendStatus(200);
            }
          });
        }
      }
    });
  }

});


/*
  FUNCTION THAT HANDLES THE CHECKEDOUTBOOKS TABLE
*/

app.get("/CheckedOutBooks.html", (req, res)=>{

  mysql.pool.query(selectQ("CheckedOutBooks"), (err, rows, fields)=>{
    // get the books authors table!
    if(err){
      // if there was an error, throw the error
      console.error(err);
      res.render("pages/CheckedOutBooks.ejs", {data:"", error:"Error getting table data"});
    }else{
      // else do something with the data
      res.render("pages/CheckedOutBooks.ejs", {data:rows, error:""});
    }
  });
});



app.post("/CheckedOutBooks", (req, res)=>{

  if(!req.body){
    console.error("No req body");
    req.sendStatus(204);
  }else{
    var pid = parseInt(req.body.patron_id);
    var bid = parseInt(req.body.book_id);

    // validation of the POST request data.
    mysql.pool.query(insertCheckedOutBooksQuery, [pid, bid], (err, result)=>{
      if(err){
        console.error(err);
        res.sendStatus(400);
      }else{
        // successfully added new item
        console.log("success");
        // redirect to page to show data.
        res.redirect("/CheckedOutBooks.html");
      }
    });

  }

});



app.put("/CheckedOutBooks", (req, res)=>{
  // updates the item if there was a change

  if(!req.body){
    console.error("No req body");
    req.sendStatus(204);
  }else{
    mysql.pool.query(searchCheckedOutBooks, [parseInt(req.body.prev_patron_id) || parseInt(req.query.prev_patron_id), parseInt(req.body.prev_book_id)||parseInt(req.query.prev_book_id)], (err, rows)=>{
      if(!err){
        // modify query
        mysql.pool.query(modifyCheckedOutBooks, [parseInt(req.body.patron_id) || rows[0].patron_id, parseInt(req.body.book_id)|| rows[0].book_id, parseInt(req.body.prev_patron_id), parseInt(req.body.prev_book_id)], (err, result)=>{
          if(err){
            console.error("Error updating checked out books");
            res.sendStatus(400);
          }else{
            console.log("success", result);
            res.sendStatus(200);
          }

        });
      }
    });

  }

});



app.delete("/checkedOutBooks", (req, res)=>{
  if(!req.body){
    console.error("No req body");
    req.sendStatus(204);
  }else{
    mysql.pool.query(searchCheckedOutBooks, [req.body.patron_id || req.query.patron_id, req.body.book_id || req.query.book_id], (err, result)=>{
      if(err){
        // error finding row
        console.error("Error deleting row");
        res.sendStatus(403);
      }else{
        if(result.length == 1){
          // delete row from the table
          mysql.pool.query(deleteCheckedOutBooksQuery, [req.body.patron_id || req.query.patron_id, req.body.book_id|| req.query.book_id], (err, result)=>{
            if(err){
              console.error("Error deleting");
              res.sendStatus(403);
            }else{
              // delete happened
              console.log("Deleted!");
              res.send();
            }
          });
        }
      }
    });
  }

});


/*

  FUNCTIONS THAT HANDLE THE BOOKAUTHORS TABLE

*/

app.get("/BookAuthors.html", (req, res)=>{
  mysql.pool.query(selectQ("BookAuthors"), (err, rows, fields)=>{
    // get the books authors table!
    if(err){
      // if there was an error, throw the error
      console.error(err);
      res.render("pages/BookAuthors.ejs", {data:"", error:"Error getting table data"});
    }else{
      // else do something with the data
      console.log(rows);
      res.render("pages/BookAuthors.ejs", {data:rows, error:""});
    }
  });
});



app.post("/BookAuthors", (req, res)=>{
  if(!req.body){
    console.error("No req body");
    req.sendStatus(204);
  }else{
    var bid = parseInt(req.body.book_id);
    var aid = parseInt(req.body.author_id);

    // validation of the POST request data.
    mysql.pool.query(insertBookAuthorQuery, [aid, bid], (err, result)=>{
      if(err){
        console.error(err);
        res.sendStatus(400);
      }else{
        // successfully added new item
        console.log("success");
        // redirect to page to show data.
        res.redirect("/BookAuthors.html");
      }
    });

  }

});



app.put("/BookAuthors", (req, res)=>{
  // updates the item if there was a change

  if(!req.body){
    console.error("No req body");
    req.sendStatus(204);
  }else{
    mysql.pool.query(searchBookAuthors, [parseInt(req.body.prev_author_id) || parseInt(req.query.prev_author_id), parseInt(req.body.prev_book_id)||parseInt(req.query.prev_book_id)], (err, rows)=>{
      if(!err){
        // modify query
        mysql.pool.query(modifyBookAuthors, [parseInt(req.body.author_id) || rows[0].author_id, parseInt(req.body.book_id)|| rows[0].book_id, parseInt(req.body.prev_author_id), parseInt(req.body.prev_book_id)], (err, result)=>{
          if(err){
            console.error("Error updating Book Authors");
            res.sendStatus(400);
          }else{
            // successfully found and modified row.
            console.log("success", result);
            res.sendStatus(200);
          }

        });
      }
    });

  }
});



app.delete("/BookAuthors", (req, res)=>{
  if(!req.body){
    console.error("No req body");
    req.sendStatus(204);
  }else{
    mysql.pool.query(searchBookAuthors, [req.body.author_id || req.query.author_id, req.body.book_id || req.query.book_id], (err, result)=>{
      if(err){
        // error finding row
        console.error("Error deleting row");
        res.sendStatus(403);
      }else{
        console.log(result);
        //if(result.length == 1){
          // delete row from the table
          mysql.pool.query(deleteBookAuthors, [req.body.author_id || req.query.author_id, req.body.book_id|| req.query.book_id], (err, result)=>{
            if(err){
              console.error("Error deleting");
              res.sendStatus(403);
            }else{
              // delete happened
              console.log("Deleted!");
              res.sendStatus(200);
            }
          });
        //}
      }
    });
  }

});




/*

  FUNCTIONS FOR THE MAIN SEARCH BAR

*/


app.post("/search", (req, res) => {
    if (!req.body) {
        // somehow the body has nothing
        var data = {
            error: "Please enter something!"
        }
        res.render("pages/index.ejs", { data: data })
    } else if (req.body.userInput == "") {
        // user tries to input nothing
        var data = {
            error: "Please enter something!"
        }
        res.render("pages/index.ejs", { data: data })
    } else {

        var table = req.body.search_by;                     // Gets table from dropdown
        var userInput = "'" + req.body.userInput + "'";     // Gets user input from search bar
        console.log(userInput);
        var data = {
            searchBy: userInput
        }
        var query = "";

        if (table == "Books") {
            query = searchTitleQ(userInput);
        } else if (table == "Authors") {
            query = searchAuthorQ(userInput);
        } else if (table == "Publishers") {
            query = searchPublisherQ(userInput);
        } else if (table == "Sections") {
            query = searchSectionQ(userInput);
        }
        console.log(query);
        mysql.pool.query(query, (err, rows, fields) => {
            if (err) {
                console.error(err);
                res.render("pages/search.ejs", { data: "", error: "error getting table data" });
            } else {
                console.log(rows);
                res.render("pages/search.ejs", { data: rows, error: "" });
            }
        });

    }
});



app.get("/search", (req,res)=>{
  // get request to /search will just send them back to main right now, can be changed if needed
  res.redirect("/index.html");
});





/*
    FUNCTION FOR FORM VALIDATION, REMOVAL OF SPECIAL CHARACTERS FROM THE STRING.
*/


function removeSpecialCharacters(toRemove){
  // function that takes a string and removes all the special characters in
  // the array below.

  // this is so that a user input cant drop our tables

  var specialCharacters = "[]+_-=!#$@%^&*();:|\.,<>?`~";

  for(var i=0; i<specialCharacters.length; i++){
    toRemove = toRemove.replaceAll(specialCharacters[i], "");
  }
  return toRemove;
}




/*
  ERROR PAGES
*/


app.use((req,res)=>{
  res.type('plain/text');
  res.status(404);
  res.send('404 - Not Found!');
})



app.use((err, req, res, next)=>{
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send("500- Server Error.")
})



app.listen(PORT, ()=>{
  console.log("Server started on http://localhost:"+PORT);
});
