const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require('./dbcon.js');

const app = express();

// IMPORTANT: change the port to whatever works the best on the flip server.
const PORT = 8636;


// set up ejs as the view engine
app.set('view engine', 'ejs');
app.use(express.static("public"));
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
const selectQuery = selectQ`SELECT * FROM ${tableName}`; // use this for all tables

// insert queries
const insertBooksQuery = `INSERT INTO Books (book_id, isbn, title, pages, publication, publisher_id, section_id, on_shelf) VALUES (?,?,?,?,?,?,?,?);`;
const insertPatronsQuery = `INSERT INTO Patrons (patron_id, first_name, last_name, address, phone) VALUES (?,?,?,?,?);`;

const insertPublishersQuery = `INSERT INTO Publishers (publisher_id, company_name) VALUES (?,?);`;
const insertCheckedOutBooksQuery = `INSERT INTO CheckedOutBooks(patron_id, book_id) VALUES (?,?);`;
const insertBookAuthorQuery =  `INSERT INTO BookAuthors(author_id, book_id) VALUES(?,?);`;


// update queries
const modifyBooksQuery = `UPDATE Books SET book_id=?, isbn=?, title=?, pages=?, publication=?, publisher_id=?, section_id=?, on_shelf=? WHERE book_id=?`;
const modifyCheckedOutBooks = `UPDATE CheckedOutBooks SET patron_id=?, book_id=? WHERE (patron_id = ? AND Book_id=?);`;
const modifyBookAuthors = `UPDATE BookAuthors SET author_id=?, book_id=? WHERE(author_id=? AND book_id=?);`;
const modifyPublishersQuery = `UPDATE Publishers SET publisher_id = ?, company_name=? WHERE publisher_id=?;`;
const modifyPatronsQuery = `UPDATE Patrons SET patron_id = ?, first_name=?, last_name=?, address=?, phone=? WHERE patron_id=?;`;

// search queries
const searchById = `SELECT * FROM ${tableName} WHERE ${idName}=?`;
const searchCheckedOutBooks = `SELECT * FROM CheckedOutBooks WHERE patron_id=? AND book_id=?;`;
const searchBookAuthors = `SELECT * FROM BookAuthors WHERE author_id=? AND book_id=?;`;


// delete Queries
const deleteQuery = `DELETE FROM ${tableName} WHERE book_id=${idName};`;


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


app.use(bodyParser.urlencoded({extended: true}));



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




app.get("/books.html", (req, res)=>{
  // for now this displays all the books in the library

  // books page, for now displays the temp books array, we need to
  // actually get data from our db and send it to the page
  // I got it working with ejs really fast.

  // this is where the query would go for showing all books
  var tempBook = [
    {
    book_id:1,
    isbn:0000000,
    title:"Book title 1",
    pages:300,
    publication:new Date(),
    publisher_id:1,
    on_shelf:true,
    section_name:"Art",
    authors:[{f_name:"temp1",l_name:"temp2"}],
    publisher_name:"Publisher name!"
  },
  {
    book_id:2,
    isbn:1111111,
    title:"book title 2",
    pages:301,
    publication:new Date(),
    publisher_id:1,
    on_shelf:false,
    section_name:"Mathematics",
    authors:[{f_name:"temp1",l_name:"temp2"}, {f_name:"temp3",l_name:"temp4"}, {f_name:"temp5",l_name:"temp5"}],
    publisher_name:"Hello"
  },
  {
    book_id:3,
    isbn:1111111,
    title:"book title 3",
    pages:301,
    publication:new Date(),
    publisher_id:5,
    on_shelf:true,
    section_name:"Computer Science",
    authors:[{f_name:"temp1",l_name:"temp2"}],
    publisher_name:"Another publisher"
  }
];

  // renders the page with the ejs templating using the tempBooks data above
  res.render("pages/books.ejs", {data:tempBook, searchTitle:""});
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
        console.log(rows);
        res.render("pages/booksTable.ejs", {data:rows, error:""});
      }
    });
});

/*
add
*/
app.post("/booksTable", (req, res)=>{
  // add item to the booksTable
  console.log("booksTable POST", req.body);

  // CLEAN ALL SPECIAL CHARACTERS FROM ALL USER INPUTS!

  if(!req.body){
    console.error("No req body");
  }else{

    console.log(parseInt(req.body.on_shelf));

    var bid = removeSpecialCharacters(req.body.book_id);
    var isb = removeSpecialCharacters(req.body.isbn);
    var ti = removeSpecialCharacters(req.body.title);
    var pa = removeSpecialCharacters(req.body.pages);
    var pub = req.body.publication;
    var pid = removeSpecialCharacters(req.body.publisher_id);
    var sid = removeSpecialCharacters(req.body.section_id);
    var ons = parseInt(req.body.on_shelf);

    var context={};
    // validation of the POST request data.
    mysql.pool.query(insertBooksQuery, [bid, isb, ti, pa, pub, pid, sid, ons], (err, result)=>{
      if(err){
        console.error(err);
        return;
      }else{
        // successfully added new item
        console.log("success");
        context.results = "Inserted id " + result.insertId;
        return;
      }
    });
    // redirect to page to show data.
    res.redirect("/booksTable.html");
  }


});


/*
update
*/

app.put("/booksTable", (req,res)=>{
  // updates the item if there was a change
  console.log("hello",req.body);

  var context = {};
  mysql.pool.query(setSearchByIdNameAndId("Books", "book_id"), [req.body.prev_id || req.query.prev_id], (err, result)=>{
    if(err){
      return;
    }else{
      console.log("got the row to change:");
      // update items where
      if(result.length == 1){
        var tempCurrentValues = result[0];
        // query the db to change items if they changed at all! else keep the current values
        mysql.pool.query(modifyBooksQuery, [
          req.body.book_id|| req.query.book_id || tempCurrentValues.book_id,
          req.body.isbn || req.query.isbn || tempCurrentValues.isbn,
          req.body.title || req.query.title || tempCurrentValues.title,
          req.body.pages || req.query.pages || tempCurrentValues.pages,
          req.body.publication || req.query.publication || tempCurrentValues.publication,
          req.body.publisher_id || req.query.publisher_id || tempCurrentValues.publisher_id,
          req.body.section_id || req.query.section_id || tempCurrentValues.section_id,
          req.body.on_shelf || req.query.on_shelf,
          req.body.prev_id || req.query.prev_id], (err, result)=>{
          // update here
          if(err){
            console.error(err);
            return;
          }else{
            console.log("updated!");
            //context.results = "Updated rows";
            res.send();
          }
        });
      }
    }
  });
});


/*
delete
*/

app.delete("/booksTable", (req, res)=>{
  mysql.pool.query(setSearchByIdNameAndId("Books", "book_id"), [req.body.id || req.query.id], (err, result)=>{
    if(err){
      console.error("Error deleting row");
      return;
    }else{
      console.log("to delete",result);
      if(result.length == 1){
        console.log("got this far");
        mysql.pool.query(setDeleteQuery("Books", "book_id"), [req.body.id || req.query.id], (err, result)=>{
          if(err){
            console.error("Error deleting");
          }else{
            console.log("Deleted!");
            res.send();
          }
        });
      }
    }
  });
});


/*
    PATRONS TABLE FUNCTIONS - HANDLES THE ADDITION, MODIFICATION, AND DELETION
    OF A PATRON FROM THE TABLE.
*/

app.get("/patronsTable.html", (req, res)=>{
console.log("patronsTable GET", req.body);
  mysql.pool.query(selectQ("Patrons"), (err, rows, fields)=>{
    // get the patrons table
    if(err){
      // if there was an error, throw the error
      console.error(err);
      res.render("pages/patronsTable.ejs", {data:"", error:"Error getting table data"});
    }else{
      // else do something with the data
      console.log(rows);
      res.render("pages/patronsTable.ejs", {data:rows, error:""});
    }
  });

});


app.post("/patronsTable", (req, res)=>{
  console.log("patronsTable POST", req.body);

  // CLEAN ALL SPECIAL CHARACTERS FROM ALL USER INPUTS!

  if(!req.body){
    console.error("No req body");
  }else{
    var pid = parseInt(removeSpecialCharacters(req.body.patron_id));
    var fn = removeSpecialCharacters(req.body.first_name);
    var ln = removeSpecialCharacters(req.body.last_name);
    var add = req.body.address;
    var ph =  req.body.phone;

    // TODO: CLEAN ADDRESS BETTER

    // validation of the POST request data.

    if(!req.body || !pid || !fn || !ln || !add | !ph){
      // user did not enter an item, give them an error and do not add the DATA
      res.render("pages/patronsTable.ejs", {data:tempPatronsData, error:"Please enter all data fields."})
    }else{
      var context={};
      // validation of the POST request data.
      mysql.pool.query(insertPatronsQuery, [pid, fn, ln, add, ph], (err, result)=>{
        if(err){
          console.error(err);
          return;
        }else{
          // successfully added new item
          console.log("success");
          context.results = "Inserted id " + result.insertId;
          return;
        }
      });
      // redirect to page to show data.
      res.redirect("/patronsTable.html");
    }
  }
});


app.put("/patronsTable", (req,res)=>{
  console.log(req.body);
  if(!req.body){
    return;
  }else{
    mysql.pool.query(setSearchByIdNameAndId("Patrons", "patron_id"),  [req.body.prev_id || req.query.prev_id], (err, rows)=>{
      console.log("rows",rows);
      if(!err){
        // modify query
        mysql.pool.query(modifyPatronsQuery, [
              parseInt(req.body.patron_id) || rows[0].patron_id || parseInt(req.query.patron_id),
              req.body.first_name||req.query.first_name || rows[0].first_name,
              req.body.last_name || req.query.last_name || rows[0].last_name,
              req.body.address || req.query.address || rows[0].address,
              req.body.phone || req.query.phone || rows[0].phone,
              parseInt(req.body.prev_id)
            ],
            (err, result)=>{
              console.log("here");
          if(err){
            console.error("Error updating Patrons");
            return;
          }
          // successfully found and modified row.
          console.log("success", result);
          res.send();
        });
      }
    });

  }
});


app.delete("/patronsTable", (req, res)=>{
  // search for the row
  mysql.pool.query(setSearchByIdNameAndId("Patrons", "patron_id"), [req.body.id || req.query.id], (err, result)=>{
    if(err){
      // error finding row
      console.error("Error deleting row");
      return;
    }else{
      if(result.length == 1){
        // delete row from the table
        mysql.pool.query(setDeleteQuery("Patrons", "patron_id"), [req.body.id || req.query.id], (err, result)=>{
          if(err){
            console.error("Error deleting");
          }else{
            // delete happened
            console.log("Deleted!");
            res.send();
          }
        });
      }
    }
  });
});



/*
   FUNCTIONS TO HANDLE THE SECTIONS TABLE, ALLOW FOR THE ADDITION, REMOVAL, AND
   MODIFICATION OF THE SECTIONS TABLE.
*/


app.get("/sectionsTable.html", (req,res)=>{
  res.render("pages/sectionsTable.ejs", {data:tempSectionData, error:""});
});



app.post("/sectionsTable", (req, res)=>{
  console.log(req.body);
  var temp={
    section_id:req.body.section_id,
    section_name:req.body.section_name
  };
  console.log(tempSectionData)
  tempSectionData.push(temp);
  res.render("pages/sectionsTable.ejs", {data:tempSectionData, error:""});
});



app.put("/sectionsTable", (req, res)=>{
  // TODO: if only 1 thing was modified we dont wanna modify the entire table
  // again right?
  tempSectionData["section_id"] = req.body.section_id;
  tempSectionData["section_name"] = req.body.section_name;
  res.send("got a PUT request");
});


// check this since the sections table doesnt display yet
app.delete("/sectionsTable", (req, res)=>{
  mysql.pool.query(setSearchByIdNameAndId("Sections", "section_id"), [req.body.id || req.query.id], (err, result)=>{
    if(err){
      console.error("Error deleting row");
      return;
    }else{
      if(result.length == 1){
        mysql.pool.query(setDeleteQuery("Sections", "section_id"), [req.body.id || req.query.id], (err, result)=>{
          if(err){
            console.error("Error deleting");
          }else{
            console.log("Deleted!");
            res.send();
          }
        });
      }
    }
  });
});



/*

  FUNCTIONS FOR THE PUBLISHERS TABLE -- ALLOWS FOR THE ADDITION, REMOVAL, AND
  MODIFICATION OF THE PUBLISHERS TABLE.

*/


app.get("/publishersTable.html", (req, res)=>{

  // shows all the data in the books table
  console.log(selectQ("Publishers"));

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
  }else{
    var pid = parseInt(req.body.publisher_id);
    var cn = req.body.company_name;

    var context={};
    // validation of the POST request data.
    mysql.pool.query(insertPublishersQuery , [pid, cn], (err, result)=>{
      if(err){
        console.error(err);
        return;
      }else{
        // successfully added new item
        console.log("success");
        context.results = "Inserted id " + result.insertId;
        return;
      }
    });
    // redirect to page to show data.
    res.redirect("/publishersTable.html");
  };
});



app.put("/publishersTable", (req, res)=>{

  if(!req.body){
    return;
  }else{
    mysql.pool.query(setSearchByIdNameAndId("Publishers", "publisher_id"),  [req.body.prev_id || req.query.prev_id], (err, rows)=>{
      if(!err){
        // modify query
        mysql.pool.query(modifyPublishersQuery, [parseInt(req.body.publisher_id) || rows[0].publisher_id || parseInt(req.query.publisher_id), req.body.company_name|| rows[0].company_name, parseInt(req.body.prev_id)], (err, result)=>{
          if(err){

            console.error("Error updating publihsers");
          }
          // successfully found and modified row.
          console.log("success", result);
          res.send();
        });
      }
    });

  }
});



app.delete("/publishersTable", (req, res)=>{
  // search for the row
  mysql.pool.query(setSearchByIdNameAndId("Publishers", "publisher_id"), [req.body.id || req.query.id], (err, result)=>{
    if(err){
      // error finding row
      console.error("Error deleting row");
      return;
    }else{
      if(result.length == 1){
        // delete row from the table
        mysql.pool.query(setDeleteQuery("Publishers", "publisher_id"), [req.body.id || req.query.id], (err, result)=>{
          if(err){
            console.error("Error deleting");
          }else{
            // delete happened
            console.log("Deleted!");
            res.send();
          }
        });
      }
    }
  });
});


/*

  FUNCTIONS TO HANDLE THE AUTHORS TABLE.

*/


app.get("/authorsTable.html", (req, res)=>{
  res.render("pages/authorsTable.ejs", {data:tempAuthorsData, error:""});
});



app.post("/authorsTable", (req, res)=>{
  console.log(req.body);
  var temp = {
    author_id:removeSpecialCharacters(req.body.author_id),
    first_name:removeSpecialCharacters(req.body.first_name),
    last_name:removeSpecialCharacters(req.body.last_name)
  };

  tempAuthorsData.push(temp);
  res.render("pages/authorsTable.ejs", {data:tempAuthorsData, error:""});
});



app.put("/authorsTable", (req, res)=>{
  tempAuthorsData["author_id"] = req.body.author_id;
  tempAuthorsData["first_name"] = req.body.first_name;
  tempAuthorsData["last_name"] = req.body.last_name;
  res.send("got a PUT request");
});



app.delete("/authorsTable", (req, res)=>{
  // search for the row
  mysql.pool.query(setSearchByIdNameAndId("Authors", "author_id"), [req.body.id || req.query.id], (err, result)=>{
    if(err){
      // error finding row
      console.error("Error deleting row");
      return;
    }else{
      if(result.length == 1){
        // delete row from the table
        mysql.pool.query(setDeleteQuery("Authors", "author_id"), [req.body.id || req.query.id], (err, result)=>{
          if(err){
            console.error("Error deleting");
          }else{
            // delete happened
            console.log("Deleted!");
            res.send();
          }
        });
      }
    }
  });
});


/*
  FUNCTION THAT HANDLES THE CHECKEDOUTBOOKS TABLE
*/

app.get("/CheckedOutBooks.html", (req, res)=>{
  console.log(selectQ("CheckedOutBooks"));


  mysql.pool.query(selectQ("CheckedOutBooks"), (err, rows, fields)=>{
    // get the books authors table!
    if(err){
      // if there was an error, throw the error
      console.error(err);
      res.render("pages/CheckedOutBooks.ejs", {data:"", error:"Error getting table data"});
    }else{
      // else do something with the data
      console.log(rows);
      res.render("pages/CheckedOutBooks.ejs", {data:rows, error:""});
    }
  });
});



app.post("/CheckedOutBooks", (req, res)=>{
  console.log("CheckedOutBooks POST", req.body);

  // CLEAN ALL SPECIAL CHARACTERS FROM ALL USER INPUTS!

  if(!req.body){
    console.error("No req body");
  }else{
    var pid = parseInt(req.body.patron_id);
    var bid = parseInt(req.body.book_id);

    var context={};
    // validation of the POST request data.
    mysql.pool.query(insertCheckedOutBooksQuery, [pid, bid], (err, result)=>{
      if(err){
        console.error(err);
        return;
      }else{
        // successfully added new item
        console.log("success");
        context.results = "Inserted id " + result.insertId;
        return;
      }
    });
    // redirect to page to show data.
    res.redirect("/CheckedOutBooks.html");
  }

});



app.put("/CheckedOutBooks", (req, res)=>{
  // updates the item if there was a change
  console.log("hello",req.body);

  if(!req.body){
    return;
  }else{
    mysql.pool.query(searchCheckedOutBooks, [parseInt(req.body.prev_patron_id) || parseInt(req.query.prev_patron_id), parseInt(req.body.prev_book_id)||parseInt(req.query.prev_book_id)], (err, rows)=>{
      if(!err){
        // modify query
        mysql.pool.query(modifyCheckedOutBooks, [parseInt(req.body.patron_id) || rows[0].patron_id, parseInt(req.body.book_id)|| rows[0].book_id, parseInt(req.body.prev_patron_id), parseInt(req.body.prev_book_id)], (err, result)=>{
          if(err){
            console.error("Error updating checked out books");

          }
          console.log("success", result);
          res.send();
        });
      }
    });

  }

});


/*

  FUNCTIONS THAT HANDLE THE BOOKAUTHORS TABLE

*/

app.get("/BookAuthors.html", (req, res)=>{
  console.log(selectQ("BookAuthors"));

  tableName = "BookAuthors";

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
  // add item to the booksTable
  console.log("BookAuthors POST", req.body);

  // CLEAN ALL SPECIAL CHARACTERS FROM ALL USER INPUTS!

  if(!req.body){
    console.error("No req body");
  }else{
    var bid = parseInt(req.body.book_id);
    var aid = parseInt(req.body.author_id);

    var context={};
    // validation of the POST request data.
    mysql.pool.query(insertBookAuthorQuery, [aid, bid], (err, result)=>{
      if(err){
        console.error(err);
        return;
      }else{
        // successfully added new item
        console.log("success");
        context.results = "Inserted id " + result.insertId;
        return;
      }
    });
    // redirect to page to show data.
    res.redirect("/BookAuthors.html");
  }

});



app.put("/BookAuthors", (req, res)=>{
  // updates the item if there was a change
  console.log("hello",req.body);

  if(!req.body){
    return;
  }else{
    mysql.pool.query(searchBookAuthors, [parseInt(req.body.prev_author_id) || parseInt(req.query.prev_author_id), parseInt(req.body.prev_book_id)||parseInt(req.query.prev_book_id)], (err, rows)=>{
      if(!err){
        // modify query
        mysql.pool.query(modifyBookAuthors, [parseInt(req.body.author_id) || rows[0].author_id, parseInt(req.body.book_id)|| rows[0].book_id, parseInt(req.body.prev_author_id), parseInt(req.body.prev_book_id)], (err, result)=>{
          if(err){
            console.error("Error updating Book Authors");
          }
          // successfully found and modified row.
          console.log("success", result);
          res.send();
        });
      }
    });

  }
});




/*

  FUNCTIONS FOR THE MAIN SEARCH BAR

*/


app.post("/search", (req,res)=>{
  if(!req.body){
    // somehow the body has nothing
    var data={
      error:"Please enter something!"
    }
    res.render("pages/index.ejs", {data:data})
  }else if (req.body.userInput == "") {
    // user tries to input nothing
    var data={
      error:"Please enter something!"
    }
    res.render("pages/index.ejs", {data:data})
  }else{
    // user input something, clean their input and search based on that
    var searchBy = req.body.search_by;
    var userInput = removeSpecialCharacters(req.body.userInput);
    var data={
      searchBy:userInput
    }

    /*
      THIS IS WHERE WE WOULD QUERY THE SEARCH BASED ON USER INPUT

    */

    var fake_book_data=[
      {
        book_id:1,
        isbn:0000000,
        title:userInput,
        pages:300,
        publication:new Date(),
        publisher_id:1,
        on_shelf:true,
        section_name:"Art",
        authors:[{f_name:"temp1",l_name:"temp2"}],
        publisher_name:"pub name"
      }
    ];


    var fake_author_data=[
      {
        book_id:1,
        isbn:0000000,
        title:"temp book title :)",
        pages:300,
        publication:new Date(),
        publisher_id:1,
        on_shelf:true,
        section_name:"Art",
        authors:[{f_name:userInput,l_name:"temp2"}],
        publisher_name:"pub name"
      }
    ];


    var fake_pub_data=[
      {
        book_id:1,
        isbn:0000000,
        title:"temp book title :)",
        pages:300,
        publication:new Date(),
        publisher_id:1,
        on_shelf:true,
        section_name:"Art",
        authors:[{f_name:"temp2",l_name:"temp2"}],
        publisher_name:userInput
      }
    ];


    var fake_section_data=[
      {
        book_id:1,
        isbn:0000000,
        title:"temp book title :)",
        pages:300,
        publication:new Date(),
        publisher_id:1,
        on_shelf:true,
        section_name:userInput,
        authors:[{f_name:"temp2",l_name:"temp2"}],
        publisher_name:"Pub :)"
      }
    ];

    var fake_data_dict={
      books:fake_book_data,
      authors:fake_author_data,
      publishers:fake_pub_data,
      sections:fake_section_data
    };

    var f_data=fake_data_dict[searchBy];

    /*
      END OF FAKE DATA
    */

    // render of the page books

    res.render("pages/books.ejs", {data:f_data, searchTitle: userInput});
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
