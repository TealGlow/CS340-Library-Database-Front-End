const BASE_URL = "http://"+window.location.hostname+":"+window.location.port;




const getSearchInput = async () => {
    event.preventDefault();

    let temp = document.getElementsByClassName("searchDB");
    var data = {
        input: "",
        type: ""
    };

    console.log(temp);

    //for (var i = 0; i < temp[0].length - 1; i++) {
    //    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
    //}
};



/*

  FUNCTIONS FOR FORM VALIDATION ON THE BOOKS TABLE

*/


const addAndValidateFormBooks = async ()=>{
    // FOR ADDING SOMETING INTO THE TABLE
    event.preventDefault();
    // nothing in books can be null

    // TO DO: DONT LET USER ENTER INCORRECT DATA

    console.log(BASE_URL);

    let temp = document.getElementsByClassName("form-control-add");


    var data={
      isbn:"",
      title:"",
      pages:"",
      publication:"",
      publisher_id:"",
      section_id:"",
      on_shelf:""
    };

    for(var i=0; i<temp.length; i++){
      data[temp[i].name] = await cleanData(temp[i].value);
    }

    data["publication"] = new Date(temp[3].value);
    data["section_id"] = parseInt(data["section_id"]);
    data["publisher_id"] = parseInt(data["publisher_id"]);
    data["pages"] = parseInt(data["pages"]);
    data["on_shelf"] = parseInt(data["on_shelf"]);

    // validation for section_id
    if(data["section_id"] == 0 && data["publisher_id"]==0){
      document.getElementById("data-add-error").innerHTML = "Please enter a valid id";
    }

    //validation for isbn
    if(data["isbn"].toString().length != 13 || data["isbn"] != parseInt(data["isbn"])){
      // isbns are usually 13 digits
      document.getElementById("data-add-error").innerHTML = "ISBN is not the correct format.";
    }else{
      if(data["isbn"] =="" || data["title"] == "" || data["pages"] == "" || isNaN(data["publication"].getTime()) || data["publisher_id"] == "" || data["section_id"] == ""){
        console.log("Error please enter all data fields!");
        document.getElementById("data-add-error").innerHTML = "Please enter all fields.";
      }else{
        // else we did it and we can send the data to the db!
        // send a request to the db
        reqServer("POST", "/booksTable", data);
      }
    }





};



const validateFormBooks = async (i)=>{
  // FOR MODIFICATION OF DATA IN THE TABLE
  event.preventDefault();
  let temp = document.getElementsByClassName("row-data");
  let toSubmit = temp[i];

  var data={
    book_id:parseInt(toSubmit["modify"].value),
    isbn:"",
    title:"",
    pages:"",
    publication:"",
    publisher_id:"",
    section_id:"",
    on_shelf:""
  };

  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }
  data["pages"] = parseInt(data["pages"]);
  data["publisher_id"] = parseInt(data["publisher_id"]);
  data["section_id"] = parseInt(data["section_id"]);
  data["isbn"] = parseInt(data["isbn"]);
  data["publication"] = new Date(toSubmit[4].value);

  if(toSubmit[6].value == "0"){
    data["on_shelf"] = 0;
  }else{
    data["on_shelf"] = 1;
  }

  // isbn form validation
  if(data["isbn"] && data["isbn"].toString().length != 13){
    // isbns are usually 13 digits
    document.getElementById("data-add-error").innerHTML = "ISBN is not the correct format.";
  }else if(data["isbn"] && data["isbn"] != parseInt(data["isbn"])){
    document.getElementById("data-add-error").innerHTML = "ISBN is not the correct format.";
  }else{
    // after data is cleaned
    reqServer("PUT", "/booksTable", data);
  }




};



const booksTableRemoval = async (i)=>{
  // i is going to be the id of the book to remove
  event.preventDefault();
  data={id:i};

  reqServer("DELETE", "/booksTable", data);
};



/*

  FUNCTIONS FOR THE SECTIONS TABLE

*/


const addAndValidateFormSections = async ()=>{
  event.preventDefault();
  let temp = document.getElementsByClassName("addData");
  let toSubmit = temp;
  var data={
    section_name:""
  };

  for(var i=0; i<temp[0].length-1; i++){
    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
  }
  if(data["section_name"] == ""){
    document.getElementById("data-add-error").innerHTML = "Please enter all fields.";

  }else{
    // sending the data to the server

    reqServer("POST", "/sectionsTable", data);
  }

};



const validateFormSections = async (i)=>{
  event.preventDefault();
  let temp = document.getElementsByClassName("row-data");
  let toSubmit = temp[i];

  console.log(temp[i]);

  var data={
    section_id:parseInt(toSubmit["modify"].value),
    section_name:""
  };


  for(var j=0; j<toSubmit.length; j++){
    data[toSubmit[j].name] = await cleanData(toSubmit[j].value);
  }


  if(data["section_name"] == ""){
    document.getElementById("data-add-error").innerHTML = "Please check that all your fields are correct.";
  }else{
    // after data clean
    console.log(data);

    reqServer("PUT", "/sectionsTable", data);
  }

};



const sectionsTableRemoval = async (i)=>{
  event.preventDefault();
  data={id:i}

  reqServer("DELETE", "/sectionsTable", data);
};



/*

  FUNCTIONS FOR THE PATRONS TABLE

*/


const addAndValidateFormPatrons = async ()=>{
  // FOR ADDING SOMETING INTO THE TABLE
  event.preventDefault();
  // nothing in books can be null

  // TO DO: DONT LET USER ENTER INCORRECT DATA

  let temp = document.getElementsByClassName("addData");
  var data={
    first_name:"",
    last_name:"",
    address:"",
    phone:""
  };


  // TODO: CLEAN PUBLICATION WITHOUT BLASTING THE DATA

  for(var i=0; i<temp[0].length-1; i++){
    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
  }
  data["phone"] = parseInt($(temp)[0][3].value);

  //phone number form VALIDATION
  console.log(data["phone"].toString().length);
  if(data["phone"].toString().length != 10){
      // we want a 10 digit phone number with area code ex: 5035555555
      document.getElementById("data-add-error").innerHTML = "Phone number format incorrect, please enter a 10 digit phone number with area code.";
  }else{
    if(data["first_name"] =="" || data["last_name"] == "" || data["address"] == "" || data["phone"] == ""){
      console.log("Error please enter all data fields!");
      document.getElementById("data-add-error").innerHTML = "Please enter all fields.";
    }else{
      // else we did it and we can send the data to the db!
      // send a request to the db
      reqServer("POST", "/patronsTable", data);
    }
  }
};



const validateFormPatrons = async (i)=>{
  event.preventDefault();

  let temp = document.getElementsByClassName("row-data");
  let toSubmit = temp[i];


  var data={
    patron_id:parseInt(toSubmit["modify"].value),
    first_name:"",
    last_name:"",
    address:"",
    phone:""
  };



  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }

  data["address"] = $(toSubmit)[0][2].value;
  data["phone"] = parseInt($(toSubmit)[0][3].value);

  //phone number VALIDATION
  if(data["phone"] && data["phone"].toString().length != 10){
    // incorrect phone number
      document.getElementById("data-add-error").innerHTML = "Phone number format incorrect, please enter a 10 digit phone number with area code.";
  }else{
    if(!data["first_name"] && !data["last_name"] && !data["address"] && !data["phone"]){
      document.getElementById("data-add-error").innerHTML = "Please check that all your fields are correct.";
    }else{
      // after data clean
      reqServer("PUT", "/patronsTable", data);
    }
  }


};



const patronsTableRemoval = async(i)=>{
  event.preventDefault();
  data={id:i}

  reqServer("DELETE", "/patronsTable", data);
};



/*

  FUNCTIONS FOR THE PUBLISHERS TABLE.

*/


const addAndValidateFormPublishers = async ()=>{
  // FOR ADDING SOMETING INTO THE TABLE
  event.preventDefault();

  let temp = document.getElementsByClassName("addData");

  var data={
    company_name:""
  };


  for(var i=0; i<temp[0].length-1; i++){
    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
  }

  if(data["company_name"] == ""){
    console.log("Error please enter all data fields!");
    document.getElementById("data-add-error").innerHTML = "Please enter all fields.";
  }else{
    // else we did it and we can send the data to the db!
    // send a request to the db
    reqServer("POST", "/publishersTable", data);
  }


};



const validateFormPublishers = async (i)=>{
  event.preventDefault();

  let temp = document.getElementsByClassName("row-data");
  let toSubmit = temp[i];

  console.log(i, toSubmit);
  var data={
    publisher_id:parseInt(toSubmit["modify"].value),
    company_name:""
  };


  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }

  if(data["company_name"] == ""){
    document.getElementById("data-add-error").innerHTML = "Please check that all your fields are correct.";
  }else{
    // after data clean
    reqServer("PUT", "/publishersTable", data);
  }

};



const publishersTableRemoval = async (i)=>{
  event.preventDefault();
  data={id:i}

  reqServer("DELETE", "/publishersTable", data);
};



/*

  FUNCTION FOR THE AUTHORS TABLE

*/


const addAndValidateFormAuthors = async ()=>{
  // FOR ADDING SOMETING INTO THE TABLE
  event.preventDefault();

  let temp = document.getElementsByClassName("addData");
  var data={
    first_name:"",
    last_name:""
  };


  for(var i=0; i<temp[0].length-1; i++){
    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
  }

  if(data["first_name"] == "" || data["last_name"] == ""){
    console.log("Error please enter all data fields!");
    document.getElementById("data-add-error").innerHTML = "Please enter all fields.";
  }else{
    // else we did it and we can send the data to the db!
    // send a request to the db
    reqServer("POST", "/authorsTable", data);
  }


};



const validateFormAuthors = async (i)=>{
  event.preventDefault();

  let temp = document.getElementsByClassName("row-data");
  let toSubmit = temp[i];

  var data={
    author_id:parseInt(toSubmit["modify"].value),
    first_name:"",
    last_name:""
  };


  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }


  if(data["first_name"] == "" && data["last_name"] == ""){
    document.getElementById("data-add-error").innerHTML = "Please check that all your fields are correct.";
  }else{
    // after data clean
    reqServer("PUT", "/authorsTable", data);
  }

};



const authorsTableRemoval = async (i)=>{
  event.preventDefault();
  console.log("Delete ", i);
  data={id:i}

  reqServer("DELETE", "/authorsTable", data);
};




/*

  FUNCTIONS FOR THE CHECKEDOUTBOOKS TABLE

*/

const addAndValidateFormCheckedOut = async ()=>{
  event.preventDefault();
  let temp = document.getElementsByClassName("addData");
  let toSubmit = temp;

  var data={
    patron_id:"",
    book_id:""
  };


  for(var i=0; i<temp[0].length-1; i++){
    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
  }
  if(data.patron_id == "" || data.book_id == ""){
    document.getElementById("data-add-error").innerHTML = "Please enter all fields.";

  }else{
    // sending the data to the server
    reqServer("POST", "/CheckedOutBooks", data);
  }

};



const validateFormCheckedOut = async (i)=>{
  event.preventDefault();

  let temp = document.getElementsByClassName("row-data");
  let toSubmit = temp[i];

  // i = Index

  console.log("update!", i);
  console.log(toSubmit[0].placeholder, toSubmit[1].placeholder);

  var data={
    patron_id:"",
    book_id:"",
    prev_patron_id: parseInt(toSubmit[0].placeholder),
    prev_book_id: parseInt(toSubmit[1].placeholder),
    row:(parseInt(i)+1)
  };

  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }

  if(!data["patron_id"] && !data["book_id"]){
    //nothing was entered
    document.getElementById("data-add-error").innerHTML = "Please check that all your fields are correct.";
  }else{
    // after data clean
    reqServer("PUT", "/CheckedOutBooks", data);
  }


};



const checkedOutTableRemoval = async (i, j)=>{
  event.preventDefault();

  let temp = document.getElementsByClassName("row-data");
  let toSubmit = temp[i];

  data={
    patron_id:parseInt(i),
    book_id:parseInt(j)
  };

  reqServer("DELETE", "/checkedOutBooks", data);
};


/*

  FUNCTIONS TO HANDLE BOOKAUTHORS TABLE

*/

const addAndValidateFormBookAuthors = async ()=>{
  event.preventDefault();
  let temp = document.getElementsByClassName("addData");
  let toSubmit = temp;

  var data={
    author_id:"",
    book_id:""
  };



  for(var i=0; i<temp[0].length-1; i++){
    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
  }
  if(data.author_id == "" || data.book_id == ""){
    document.getElementById("data-add-error").innerHTML = "Please enter all fields.";

  }else{
    // sending the data to the server

    reqServer("POST", "/BookAuthors", data);
  }

};



const validateFormBookAuthors = async (i)=>{
  event.preventDefault();
  let temp = document.getElementsByClassName("row-data");
  let toSubmit = temp[i];

  // i = row Index
  //

  console.log(i, toSubmit);

  var data={
    author_id:"",
    book_id:"",
    prev_author_id:parseInt(toSubmit[0].placeholder),
    prev_book_id:parseInt(toSubmit[1].placeholder)
  };

  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = parseInt(await cleanData($(toSubmit)[0][j].value));
  }

  if(!data["author_id"] && !data["book_id"]){
    //nothing was entered
    document.getElementById("data-add-error").innerHTML = "Please check that all your fields are correct.";
  }else{
    // after data clean
    reqServer("PUT", "/BookAuthors", data);
  }


};



const bookAuthorsTableRemoval = async (i,j)=>{
  event.preventDefault();

  // i = author_id
  // j = book_id
  data={
    author_id:parseInt(i),
    book_id:parseInt(j)
  };

  console.log(data);

  reqServer("DELETE", "/BookAuthors", data);
};






/*
   FUNCTION TO REQUEST THE SERVER WITH REQUEST TYPE, DATA AND LOCATION
*/


const reqServer = (reqType, loc, data)=>{
  /*
    reqType = "POST" or "GET" or "PUT" or "DELETE"
    loc = end point on the Server
    data = payload to send to that end point
  */
  event.preventDefault();
  var req = new XMLHttpRequest();
  const url = BASE_URL+loc;

  req.open(reqType, url, true); // set request type
  req.setRequestHeader('Content-Type', 'application/json');

  // wait for the server to send data back
  req.addEventListener('load', ()=>{
      if(req.status == 204){
        // no data sent
        document.getElementById("data-add-error").innerHTML = "Error: No data sent.";
      }else if(req.status == 304){
        // data not modified
        document.getElementById("data-add-error").innerHTML = "Error: Data not modified.";
      }else if(req.status == 400){
        // bad request
        document.getElementById("data-add-error").innerHTML = "Error updating: please make sure that the foreign keys are correct.";
      }else if(req.status >= 200 && req.status < 400){
        // success
        console.log("Update successful!");
        alert("Success!");
        setTimeout(10);
        location.reload();
      }else{
        // some sort of error happened
        console.log("Error requesting the server, check the end point!");
        document.getElementById("data-add-error").innerHTML = "Error updating: Please check the server endpoint";
      }
  });

  // send the data payload
  req.send(JSON.stringify(data));
};



/*
  FUNCTIONS FOR CLEANING OF THE DATA SO THAT USERS CANNOT DROP OUR TABLES
*/


const cleanData = async (toClean)=> {
    var specialCharacters = "[]+_-=!#$@%^&*();:|\.,<>?`~";

    for(var i=0; i<specialCharacters.length; i++){
      toClean = toClean.replaceAll(specialCharacters[i], "");
    }
    return toClean;
};
