// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var room = "";

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post("/create-room", roomCreation);

app.post("/", toRoom);

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

function roomCreation(req, resp){
  if(req.param('username')){
      resp.status(201).send(room);

  } else {
     resp.status(400).send({
      error: "missing username parameter"
    }); 
  }
}

function toRoom(req, resp){
  if(req.param('userId')){
      resp.status(201).end();

  } else {
     resp.status(400).send({
      error: "missing userId parameter"
    }); 
  }  
}