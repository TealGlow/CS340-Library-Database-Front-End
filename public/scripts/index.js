const BASE_URL = "http://localhost:3000";



/*

  FUNCTIONS FOR FORM VALIDATION ON THE BOOKS TABLE

*/


const addAndValidateFormBooks = async ()=>{
    // FOR ADDING SOMETING INTO THE TABLE
    event.preventDefault();
    // nothing in books can be null

    // TO DO: DONT LET USER ENTER INCORRECT DATA

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
    data["publication"] = $(temp)[0][4].value;

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

  var data={
    "book_id":"",
    "isbn":"",
    "title":"",
    "pages":"",
    "publication":"",
    "publisher_id":"",
    "section_id":"",
    "on_shelf":"",
    "prev_id":i
  };

  for(var j=0; j<toSubmit.length; j++){
    data[$(toSubmit)[0][j].name] = await cleanData($(toSubmit)[0][j].value);
  }
  // after data clean
  reqServer("PUT", "/booksTable", data);

};



const booksTableRemoval = async (i)=>{
  // i is going to be the id of the book to remove
  event.preventDefault();
  console.log("Delete", i);

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
