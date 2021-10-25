const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

// IMPORTANT: change the port to whatever works the best on the flip server.
const PORT = 3000;

// set up ejs as the view engine
app.set('view engine', 'ejs');
app.use(express.static("public"));

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
  res.render("pages/index.ejs");
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
    res.render("pages/success.ejs", {data:data});
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
    on_shelf:true
  },
  {
    book_id:2,
    isbn:1111111,
    title:"book title 2",
    pages:301,
    publication:new Date(),
    publisher_id:1,
    on_shelf:false
  },
  {
    book_id:3,
    isbn:1111111,
    title:"book title 3",
    pages:301,
    publication:new Date(),
    publisher_id:5,
    on_shelf:true
  }
];

  // renders the page with the ejs templating using the tempBooks data above
  res.render("pages/books.ejs", {data:tempBook});
});



/*
      FUNCTIONS TO HANDLE THE ADDITION AND SEARCH OF A PATRON.
*/
app.get("/patrons.html", (req, res)=>{
  // serving up the patrons page
  res.render("pages/patrons.ejs");
});



/*
      FUNCTIONS TO HANDLE THE SEARCH OF PUBLISHERS AND SEARCH OF BOOK BY PUBLISHERS
*/

app.get("/publishers.html", (req, res)=>{
  // serving up the publishers page
  res.render("pages/publishers.ejs");
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
      FUNCTIONS TO HANDLE THE SEARCH OF AUTHORS AND SEARCH OF BOOK SBY AUTHORS
*/

app.get("/authors.html", (req, res)=>{
  res.render("pages/authors.ejs");
});



/*
    FUNCTION FOR FORM VALIDATION, REMOVAL OF SPECIAL CHARACTERS FROM THE STRING.
*/
function removeSpecialCharacters(toRemove){
  // function that takes a string and removes all the special characters in
  // the array below.

  // this is so that a user input cant drop our tables

  var specialCharacters = "[]+_-=!@#$%^&*();:|\.,<>?`~";

  for(var i=0; i<specialCharacters.length; i++){
    toRemove = toRemove.replaceAll(specialCharacters[i], "");
  }
  return toRemove;
}



app.listen(PORT, ()=>{
  console.log("Server started on http://localhost:"+PORT);
});
