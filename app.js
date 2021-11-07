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
//app.use("/test", require("./test.js"));

app.use(bodyParser.urlencoded({extended: true}));


/*
  FAKE data

*/
var tempBookShow = [
    {
      book_id:0,
      isbn:0000000,
      title:"Book title 1",
      pages:300,
      publication:'1999-01-02',
      publisher_id:0, //FK
      section_id:0,  //FK
      on_shelf:true,
    },
    {
      book_id:1,
      isbn:1111111,
      title:"Book title 2",
      pages:300,
      publication:'1999-01-03',
      publisher_id:1, //FK
      section_id:1,  //FK
      on_shelf:false,
    },
    {
      book_id:2,
      isbn:222222,
      title:"Book title 3",
      pages:300,
      publication:'1999-01-05',
      publisher_id:2, //FK
      section_id:2,  //FK
      on_shelf:true,
    },
];


var tempSectionData=[
  {
    section_id:0,
    section_name:"Computer Science"
  },
  {
    section_id:1,
    section_name:"Art"
  }
];


var tempPatronsData=[
  {
    patron_id:0,
    first_name:"Jesse",
    last_name:"Team Rocket",
    address:"Street name here",
    phone:"555-555-5555"
  },
  {
    patron_id:1,
    first_name:"James",
    last_name:"Team Rocket",
    address:"Street name here",
    phone:"555-555-5555"
  },
  {
    patron_id:2,
    first_name:"Meowth",
    last_name:"Thats right",
    address:"Street name here",
    phone:"555-555-5555"
  }
];


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



/*
      FUNCTIONS TO HANDLE THE CHECK OUT OF A BOOK AND FORM VALIDATION FOR
      BOOK CHECK OUT PAGES.
*/

app.post("/handleCheckOut.html", (req,res)=>{
  // handles the user check out form 1 where we are assuming the patron
  // is already in the system, we need to make another page for when the
  // patron needs to sign up

  if(req.body.on_shelf){
    res.render("pages/handleCheckOut.ejs", {data:req.body});
  }

});



app.get("/handleCheckOut.html", (req,res)=>{
  // we do not get here from a get request
  // if the user goes to this page without selecting a book to checkout
  // they will be sent back to index.html
  res.redirect("/index.html");
});



app.post("/validateFormCheckOut", (req,res)=>{
  // validates the form, if there is an error we send the user an error.

  // function that removes special characters from the user input
  // so that they cant do stuff like dropping our tables.
  var first_name = removeSpecialCharacters(req.body.firstName);
  var last_name = removeSpecialCharacters(req.body.lastName);


  var data={
    title:req.body.title,
    book_id:req.body.book_id,
    firstName:first_name,
    lastName:last_name,
    error:""
  };

  if(!data.firstName || !data.lastName){
    // error with their first or last name, give them an error.

    data.error="Please enter a first and last name!";
    res.render("pages/handleCheckOut.ejs", {data:data});
  }else{
    // assuming this is a new patron we need to
    // query the db for their information and then find the book
    // matching that id, change the status in the db

    // if we cannot find that patron we should redirect them to a page to sign
    // up instead, but that can be done later.
    console.log("sending to success");
    res.render("pages/success.ejs", {data:data, signup:""});
  }
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

    mysql.pool.query("SELECT * FROM Books", (err, rows, fields)=>{
      // get the books table!
      if(err){
        // if there was an error, throw the error
        console.error(err);
      }else{
        // else do something with the data
        console.log(rows);
        res.render("pages/booksTable.ejs", {data:rows, error:""});
      }
    });

    console.log("booksTable GET");
    //res.render("pages/booksTable.ejs", {data:rows, error:""});
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
    var ons = removeSpecialCharacters(req.body.on_shelf);

    // validation of the POST request data.

    if(!req.body || !bid || !isb || !ti || !pa || !pub || !pid || !sid  || !ons){
      // user did not enter an item, give them an error and do not add the DATA
      res.render("pages/booksTable.ejs", {data:tempBookShow, error:"Please enter all data fields."})
    }else{
      // adding the validated data to an object

      // BEFORE ADDING WE ALSO NEED TO MAKE SURE THIS ISNT ALREADY IN THE TABLE
      // OR IF DATA IS REPEATED

      var temp = {
        book_id: bid,
        isbn: isb,
        title: ti,
        pages: pa,
        publication: pub,
        publisher_id: pid,
        section_id: sid,
        on_shelf: ons
      };

      // adding that object to the DB (in this case its a temp arra)
      tempBookShow.push(temp);

      res.render("pages/booksTable.ejs", {data:tempBookShow, error:""});
    }
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
      FUNCTIONS TO HANDLE THE ADDITION AND SEARCH OF A PATRON.
*/
app.get("/patrons.html", (req, res)=>{
  // serving up the patrons page
    var tempPatrons = [
        {
            patron_id: 1,
            first_name: "Tony",
            last_name: "Stark",
            address: "1234 56th Ave, New York, NY 98765",
            phone: "555-511-2433"
        },
        {
            patron_id: 2,
            first_name: "Bruce",
            last_name: "Banner",
            address: "7890 42nd Ave, New York, NY 98765",
            phone: "555-424-6657"
        },
        {
            patron_id: 3,
            first_name: "Steve",
            last_name: "Rogers",
            address: "3857 26th Ave, New York, NY 98765",
            phone: "555-243-7345"
        }
    ]

    // serving up the patrons page
    res.render("pages/patrons.ejs", {data:tempPatrons});
});


/*
    PATRONS TABLE FUNCTIONS - HANDLES THE ADDITION, MODIFICATION, AND DELETION
    OF A PATRON FROM THE TABLE.
*/

app.get("/patronsTable.html", (req, res)=>{
  res.render("pages/patronsTable.ejs", {data: tempPatronsData, error:""})
});


app.post("/patronsTable", (req, res)=>{
  console.log("booksTable POST", req.body);

  // CLEAN ALL SPECIAL CHARACTERS FROM ALL USER INPUTS!

  if(!req.body){
    console.error("No req body");
  }else{
    var pid = removeSpecialCharacters(req.body.patron_id);
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
      // adding the validated data to an object

      // BEFORE ADDING WE ALSO NEED TO MAKE SURE THIS ISNT ALREADY IN THE TABLE
      // OR IF DATA IS REPEATED

      var temp = {
        patron_id: pid,
        first_name: fn,
        last_name: ln,
        address: add,
        phone: ph,
      };

      // adding that object to the DB (in this case its a temp arra)
      tempPatronsData.push(temp);

      res.render("pages/patronsTable.ejs", {data:tempPatronsData, error:""});
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
      FUNCTIONS TO HANDLE THE SEARCH OF PUBLISHERS AND SEARCH OF BOOK BY PUBLISHERS
*/

app.get("/publishers.html", (req, res)=>{
  var tempPublishers = [
        {
            publisher_id: 1,
            company_name: "Penguin"
        },
        {
            publisher_id: 2,
            company_name: "Macmillan"
        },
        {
            publisher_id: 3,
            company_name: "Harper Collins"
        }
    ]

    // serving up the publishers page
    res.render("pages/publishers.ejs", { data: tempPublishers } );
});



/*
      FUNCTION TO HANDLE THE SEARCH OF SECTIONS AND SEARCH OF BOOKS BY SECTIONS
*/


app.get("/sections.html", (req, res)=>{
  // for now this displays all the sections with fake data.

  // we want the section to display the books in the section right?
  // I'm assuming that we are getting a count of the union of Books and Sections here

  // this is where the query would go for showing all sections though
  var tempSections =[
      {
        section_id:1,
        section_name:"Science",
        number_of_books:10
      },
      {
        section_id:2,
        section_name:"Art",
        number_of_books:2
      },
      {
        section_id:3,
        section_name:"Computer Science",
        number_of_books:150
      },
      {
        section_id:4,
        section_name:"Fiction",
        number_of_books:150
      },
      {
        section_id:5,
        section_name:"Non-Fiction",
        number_of_books:150
      }
  ];

  // renders the sections page with the data above.
  res.render("pages/sections.ejs", {data: tempSections});
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
      FUNCTIONS TO HANDLE THE SEARCH OF AUTHORS AND SEARCH OF BOOK BY AUTHORS
*/


app.get("/authors.html", (req, res)=>{

    var tempAuthors = [
        {
            author_id: 1,
            first_name: "Mark",
            last_name: "Twain",
            quantity:10
        },
        {
            author_id: 2,
            first_name: "Charles",
            last_name: "Dickens",
            quantity:10
        },
        {
            author_id: 3,
            first_name: "John",
            last_name: "Steinbeck",
            quantity:10
        }
    ];

    res.render("pages/authors.ejs", { data: tempAuthors, searchTitle:"" } );
});



/*

    FUNCTIONS TO HANDLE THE SIGN UP FOR A NEW PATORN
*/


app.get("/signup.html", (req,res)=>{
  var data={
    error:""
  };

  res.render("pages/signup.ejs", {data:data});
});



app.post("/signup", (req, res)=>{

  if(!req.body.firstName || !req.body.lastName || !req.body.phone || !req.body.address || req.body.firstName=="" || req.body.lastName=="" || req.body.phone=="" || req.body.address==""){
    // user did not enter all the data needed
    var data={
      error:"Please enter all the fields."
    };
    res.render("pages/signup.ejs", {data:data});
  }else{
    // all the information exists, clean it
    if(req.body){
      var data={
        first_name:removeSpecialCharacters(req.body.firstName),
        last_name:removeSpecialCharacters(req.body.lastName),
        phone:removeSpecialCharacters(req.body.phone),
        address:removeSpecialCharacters(req.body.address)
      };

      // handle sending the data to the DB HERE

      res.render("pages/success.ejs", {signup:data, data:""});
    }
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
