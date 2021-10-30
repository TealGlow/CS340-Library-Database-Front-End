const BASE_URL = "http://localhost:3000";



const validateFormBooks = async (i)=>{
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
  console.log("after clean",data);

  var req = new XMLHttpRequest();
  const url=BASE_URL+"/booksTable.html";
  req.addEventListener("load", (res)=>{
    console.log("hello");
  });

  req.open("put", url, true);
  console.log(BASE_URL+"/booksTable.html");

  req.setRequestHeader('Content-Type', 'application/json');

  req.addEventListener('load', ()=>{
    console.log("request",req);
    if(req.status >= 200 && req.status < 400){
      console.log("Update successful!");
      console.log(req);
      return;
    }else{
      console.log("Error adding item!");
    }
  });

  req.send(JSON.stringify(data));
};


const cleanData = async (toClean)=> {
    var specialCharacters = "[]+_-=!#$@%^&*();:|\.,<>?`~";

    for(var i=0; i<specialCharacters.length; i++){
      toClean = toClean.replaceAll(specialCharacters[i], "");
    }
    return toClean;
}
