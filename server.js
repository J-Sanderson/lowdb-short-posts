// server.js
// where your node app starts

// init project
var express = require('express');
// setup a new database
// persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('.data/db.json')
var db = low(adapter)
var app = express();

// default user list
db.defaults({ entries: [
      {
        "title":"Orci varius natoque", 
        "entry":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a diam rutrum, scelerisque felis id, rutrum mauris. In hac habitasse platea dictumst."
      },
      {
        "title":"Pellentesque dignissim",  
        "entry":"Nam et metus at arcu elementum tempor ac sit amet neque. Nam imperdiet, ante nec semper lobortis."
      },
      {
        "title":"Sed dapibus mi vitae",
        "entry":"Vivamus tortor leo, suscipit eget viverra et, sagittis a mi."
      }
    ]
  }).write();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/entries", function (request, response) {
  var dbEntries=[];
  var users = db.get('entries').value() // Find all entries in the collection
  users.forEach(function(entry) {
    dbEntries.push([entry.title, entry.entry]); // adds their info to the dbEntries value
  });
  response.send(dbEntries); // sends dbEntries back to the page
});

// creates a new entry in the users collection with the submitted values
app.post("/entries", function (request, response) {
  db.get('entries')
    .push({ title: request.query.title, entry: request.query.entry })
    .write()
  console.log("New entry inserted in the database");
  response.sendStatus(200);
});

// removes entries from users and populates it with default users
app.get("/reset", function (request, response) {
  // removes all entries from the collection
  db.get('entries')
  .remove()
  .write()
  console.log("Database cleared");
  
  // default entries inserted in the database
  var entries = [
      {
        "title":"Orci varius natoque", 
        "entry":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a diam rutrum, scelerisque felis id, rutrum mauris. In hac habitasse platea dictumst."
      },
      {
        "title":"Pellentesque dignissim",  
        "entry":"Nam et metus at arcu elementum tempor ac sit amet neque. Nam imperdiet, ante nec semper lobortis."
      },
      {
        "title":"Sed dapibus mi vitae",
        "entry":"Vivamus tortor leo, suscipit eget viverra et, sagittis a mi."
      }
  ];
  
  entries.forEach(function(entry){
    db.get('entries')
      .push({ title: entry.title, entry: entry.entry })
      .write()
  });
  console.log("Default entries added");
  response.redirect("/");
});

// removes all entries from the collection
app.get("/clear", function (request, response) {
  // removes all entries from the collection
  db.get('entries')
  .remove()
  .write()
  console.log("Database cleared");
  response.redirect("/");
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});