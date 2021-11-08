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

const selectQuery = selectQ`SELECT * FROM ${tableName}`; // use this for all tables
const insertBooksQuery = `INSERT INTO Books (book_id, isbn, title, pages, publication, publisher_id, section_id, on_shelf) VALUES (?,?,?,?,?,?,?,?);`;
const insertPatronsQuery = `INSERT INTO Patrons (patron_id, first_name, last_name, address, phone) VALUES (?,?,?,?,?);`;


function selectQ(tblName){
  // template selectQuery
  return  `SELECT * FROM ${tblName};`;
};





app.use(bodyParser.urlencoded({extended: true}));


/*
  FAKE data

*/



var tempPublishersTable = [
  {
    publisher_id:0,
    company_name:"Temp Name 1"
  },
  {
    publisher_id:1,
    company_name:"Temp Name 2"
  }
];


var tempAuthorsData = [
  {
    author_id:0,
    first_name:"Hello",
    last_name: "world"
  },
  {
    author_id:1,
    first_name:"Another",
    last_name:"Name"
  }
];


var tempCheckedOutBooksData=[
  {
    patron_id:1,
    book_id:1
  },
  {
    patron_id:1,
    book_id:0
  },
  {
    patron_id:2,
    book_id:0
  }
];


var tempBookAuthorsData=[
  {
    author_id:1,
    book_id:1
  },
  {
    author_id:1,
    book_id:0
  },
  {
    author_id:2,
    book_id:0
  }
];



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
    console.log(selectQ("Books"));
    
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
    var bid = removeSpecialCharacters(req.body.book_id);
    var isb = removeSpecialCharacters(req.body.isbn);
    var ti = removeSpecialCharacters(req.body.title);
    var pa = removeSpecialCharacters(req.body.pages);
    var pub = req.body.publication;
    var pid = removeSpecialCharacters(req.body.publisher_id);
    var sid = removeSpecialCharacters(req.body.section_id);
    var ons = false;

    if(req.body.on_shelf == "on"){
      ons = true;
    }

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
  console.log(req.body);

  // TODO: if only 1 thing was modified we dont wanna modify the entire table
  // again right?
  tempBookShow["book_id"] = req.body.book_id;
  tempBookShow["isbn"] = req.body.isbn;
  tempBookShow["title"] = req.body.title;
  tempBookShow["pages"] = req.body.pages;
  tempBookShow["publication"] = req.body.publication;
  tempBookShow["publisher_id"] = req.body.publisher_id;
  tempBookShow["section_id"] = req.body.section_id;
  tempBookShow["on_shelf"] = req.body.on_shelf;
  res.send("got a PUT request");
});


/*
delete
*/

app.delete("/booksTable.html", (req, res)=>{
  console.log("delete");
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
      console.log(rows);
      res.render("pages/patronsTable.ejs", {data:rows, error:""});
    }
  });

});


app.post("/patronsTable", (req, res)=>{
  console.log("booksTable POST", req.body);

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
      if(req.body.on_shelf == "on"){
        ons = true;
      }
  
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
  // updates the item if there was a change
  console.log(req.body);

  // TODO: if only 1 thing was modified we dont wanna modify the entire table
  // again right?
  tempPatronsData["patron_id"] = req.body.patron_id;
  tempPatronsData["first_name"] = req.body.first_name;
  tempPatronsData["last_name"] = req.body.last_name;
  tempPatronsData["address"] = req.body.address;
  tempPatronsData["phone"] = req.body.phone;

  res.send("got a PUT request");
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



/*

  FUNCTIONS FOR THE PUBLISHERS TABLE -- ALLOWS FOR THE ADDITION, REMOVAL, AND
  MODIFICATION OF THE PUBLISHERS TABLE.

*/


app.get("/publishersTable.html", (req, res)=>{
  res.render("pages/publishersTable.ejs", {data:tempPublishersTable, error:""});
});



app.post("/publishersTable", (req, res)=>{
  console.log(req.body);
  var temp={
    publisher_id:removeSpecialCharacters(req.body.publisher_id),
    company_name:removeSpecialCharacters(req.body.company_name)
  };

  console.log(tempPublishersTable);
  tempPublishersTable.push(temp);
  res.render("pages/publishersTable.ejs", {data:tempPublishersTable, error:""});
});



app.put("/publishersTable", (req, res)=>{
  // TODO: if only 1 thing was modified we dont wanna modify the entire table
  // again right?
  tempPublishersTable["publisher_id"] = req.body.publisher_id;
  tempPublishersTable["company_name"] = req.body.company_name;
  res.send("got a PUT request");
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





/*
  FUNCTION THAT HANDLES THE CHECKEDOUTBOOKS TABLE
*/

app.get("/CheckedOutBooks.html", (req, res)=>{
    res.render("pages/CheckedOutBooks.ejs", {data:tempCheckedOutBooksData, error:""});
});


app.post("/CheckedOutBooks", (req, res)=>{
    console.log(req.body);
    var temp = {
        patron_id:removeSpecialCharacters(req.body.patron_id),
        book_id:removeSpecialCharacters(req.body.book_id)
    };

    tempCheckedOutBooksData.push(temp);
    res.render("pages/CheckedOutBooks.ejs", {data:tempCheckedOutBooksData, error:""});

});


app.put("/CheckedOutBooks", (req, res)=>{
  tempCheckedOutBooksData["patron_id"] = req.body.patron_id;
  tempCheckedOutBooksData["book_id"] = req.body.book_id;
  res.send("got a PUT request");
});


/*

  FUNCTIONS THAT HANDLE THE BOOKAUTHORS TABLE

*/

app.get("/BookAuthors.html", (req, res)=>{
  res.render("pages/BookAuthors.ejs", {data:tempBookAuthorsData, error:""});
});


app.post("/BookAuthors", (req, res)=>{
    console.log(req.body);
    var temp = {
        author_id:removeSpecialCharacters(req.body.author_id),
        book_id:removeSpecialCharacters(req.body.book_id)
    };

    tempBookAuthorsData.push(temp);
    res.render("pages/BookAuthors.ejs", {data:tempBookAuthorsData, error:""});

});


app.put("/BookAuthors", (req, res)=>{
  tempBookAuthorsData["author_id"] = req.body.author_id;
  tempBookAuthorsData["book_id"] = req.body.book_id;
  res.send("got a PUT request");
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
