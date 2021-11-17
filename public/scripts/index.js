const BASE_URL = "http://"+window.location.hostname+":"+window.location.port;




/*

  FUNCTIONS FOR FORM VALIDATION ON THE BOOKS TABLE

*/


const addAndValidateFormBooks = async ()=>{
    // FOR ADDING SOMETING INTO THE TABLE
    event.preventDefault();
    // nothing in books can be null

    // TO DO: DONT LET USER ENTER INCORRECT DATA

    console.log(BASE_URL);
    let temp = document.getElementsByClassName("addData");
    var data={
      book_id:"",
      isbn:"",
      title:"",
      pages:"",
      publication:"",
      publisher_id:"",
      section_id:"",
      on_shelf:""
    };

    console.log(temp);

    // TODO: CLEAN PUBLICATION WITHOUT BLASTING THE DATA

    for(var i=0; i<temp[0].length-1; i++){
      data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
    }
    data["publication"] = new Date($(temp)[0][4].value);

    if(data["book_id"] == "" || data["isbn"] =="" || data["title"] == "" || data["pages"] == "" || data["publication"] == "" || data["publisher_id"] == "" || data["section_id"] == "" || data["on_shelf"] == ""){
      console.log("Error please enter all data fields!");
      document.getElementById("data-add-error").innerHTML = "Please enter all fields.";
    }else{
      // else we did it and we can send the data to the db!
      // send a request to the db
      reqServer("POST", "/booksTable", data);
    }

};



const validateFormBooks = async (i)=>{
  // FOR MODIFICATION OF DATA IN THE TABLE
  event.preventDefault();
  let temp = document.getElementsByClassName("row-data");
  let toSubmit = temp[i];

  // prev id
  console.log(parseInt(toSubmit[toSubmit.length-1].value));
  // row id
  console.log(i);

  var data={
    "book_id":"",
    "isbn":"",
    "title":"",
    "pages":"",
    "publication":"",
    "publisher_id":"",
    "section_id":"",
    "on_shelf":"",
    "prev_id":parseInt(toSubmit[toSubmit.length-1].value)
  };

  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }
  data["book_id"] = parseInt(data["book_id"]);
  data["pages"] = parseInt(data["pages"]);
  data["publisher_id"] = parseInt(data["publisher_id"]);
  data["section_id"] = parseInt(data["section_id"]);
  data["isbn"] = toSubmit[1].value;
  data["publication"] = toSubmit[4].value;
  console.log("val",toSubmit[7].value);

  if(toSubmit[7].value == "0"){
    data["on_shelf"] = 0;
  }else{
    data["on_shelf"] = 1;
  }

  // after data clean
  reqServer("PUT", "/booksTable", data);

};



const booksTableRemoval = async (i)=>{
  // i is going to be the id of the book to remove
  event.preventDefault();
  data={id:i};

  console.log(data);
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
    section_id:"",
    section_name:""
  };

  for(var i=0; i<temp[0].length-1; i++){
    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
  }
  if(data.section_id == "" || data.section_name == ""){
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

  var data={
    "section_id":"",
    "section_name":"",
    "prev_id":i
  };

  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }
  // after data clean
  reqServer("PUT", "/sectionsTable", data);
};



const sectionsTableRemoval = async (i)=>{
  event.preventDefault();
  console.log("Delete", i);
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
    patron_id:"",
    first_name:"",
    last_name:"",
    address:"",
    phone:""
  };

  console.log(temp);

  // TODO: CLEAN PUBLICATION WITHOUT BLASTING THE DATA

  for(var i=0; i<temp[0].length-1; i++){
    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
  }
  data["phone"] = $(temp)[0][4].value;

  if(data["patron_id"] == "" || data["first_name"] =="" || data["last_name"] == "" || data["address"] == "" || data["phone"] == ""){
    console.log("Error please enter all data fields!");
    document.getElementById("data-add-error").innerHTML = "Please enter all fields.";
  }else{
    // else we did it and we can send the data to the db!
    // send a request to the db
    reqServer("POST", "/patronsTable", data);
  }


};



const validateFormPatrons = async (i)=>{
  event.preventDefault();

  let temp = document.getElementsByClassName("row-data");
  let toSubmit = temp[i];


  var data={
    "patron_id":"",
    "first_name":"",
    "last_name":"",
    "address":"",
    "phone":"",
    "prev_id":i
  };


  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }

  data["address"] = $(toSubmit)[0][3];
  data["phone"] = $(toSubmit)[0][4];
  // after data clean
  reqServer("PUT", "/patronsTable", data);
};



const patronsTableRemoval = async(i)=>{
  event.preventDefault();
  console.log("Delete", i);
};



/*

  FUNCTIONS FOR THE PUBLISHERS TABLE.

*/


const addAndValidateFormPublishers = async ()=>{
  // FOR ADDING SOMETING INTO THE TABLE
  event.preventDefault();
  // nothing in books can be null

  // TO DO: DONT LET USER ENTER INCORRECT DATA

  let temp = document.getElementsByClassName("addData");

  var data={
    publisher_id:"",
    company_name:"",
  };

  console.log(temp);

  // TODO: CLEAN PUBLICATION WITHOUT BLASTING THE DATA

  for(var i=0; i<temp[0].length-1; i++){
    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
  }

  if(data["publisher_id"] == "" || data["company_name"] =="" ){
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
    publisher_id:"",
    company_name:"",
    prev_id:parseInt(toSubmit[0].placeholder)
  };


  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }

  data["publisher_id"] = parseInt(data["publisher_id"]);

  // after data clean
  reqServer("PUT", "/publishersTable", data);
};



const publishersTableRemoval = async (i)=>{
  event.preventDefault();
  console.log("Delete", i);
};



/*

  FUNCTION FOR THE AUTHORS TABLE

*/


const addAndValidateFormAuthors = async ()=>{
  // FOR ADDING SOMETING INTO THE TABLE
  event.preventDefault();
  // nothing in books can be null

  // TO DO: DONT LET USER ENTER INCORRECT DATA

  let temp = document.getElementsByClassName("addData");
  var data={
    author_id:"",
    first_name:"",
    last_name:""
  };

  console.log(temp);

  // TODO: CLEAN PUBLICATION WITHOUT BLASTING THE DATA

  for(var i=0; i<temp[0].length-1; i++){
    data[$(temp)[0][i].name] = await cleanData($(temp)[0][i].value);
  }

  if(data["author_id"] == "" || data["first_name"] ==""|| data["last_name"] =="" ){
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
    author_id:"",
    first_name:"",
    last_name:"",
    prev_id:i
  };


  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }

  // after data clean
  reqServer("PUT", "/authorsTable", data);
};



const authorsTableRemoval = async (i)=>{
  event.preventDefault();
  console.log("Delete", i);
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
  // after data clean
  reqServer("PUT", "/CheckedOutBooks", data);
};



const checkedOutTableRemoval = async (i)=>{
  event.preventDefault();
  console.log("Delete", i);
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
  // after data clean
  reqServer("PUT", "/BookAuthors", data);
};



const bookAuthorsTableRemoval = async (i)=>{
  event.preventDefault();
  console.log("Delete", i);
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
      if(req.status >= 200 && req.status < 400){
        // success
        console.log("Update successful!");
        location.reload();
        return;
      }else{
        // some sort of error happened
        console.log("Error requesting the server, check the end point!");
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
