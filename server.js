// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//import the DAOs
const RoomCreationDAO = require('./DAOs');

//import the user class
const User = require('./User');

//import the room class
const Room = require('./Room');

//id generator 
var shortid = require('shortid');


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

/*
  endpoint used when the player clicks on the create game button
    body of the request must contain :
      - username : field containing a string representing the username that the player chose
      
    returns :
      - status 201 + RoomCreationDAO : object containing :
        roomId : the id of the room that was generated
        userId : the id of the user that created the room
        
      OR
      
      - status 400 if the username parameter is missing
*/
app.post("/create-room", [createUserOnRequest, createRoomOnRequest]);

/*
  endpoint used when a player clicks on the join game button
    body of the request is empty but the path must contain the id of the room the player wants to join
    example : the request should be addressed to https://schtroum-phou-troll.glitch.me/656546545
    
    returns :
      - status 200 + user id of the new player
      
      OR
      
      - status 400 and message missing parameter if the room was not given in the path
      
      OR
      
      - status 404 if the room id is incorrect
*/
app.get("/:id", [createUserOnRequest, joinRoomOnRequest]);

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

//USER CREATION

//function that creates a user with a username and an id that is unique
function createUser(username){
  
  //we generate a first id
  var userId = shortid.generate();
  
  //we call the method that assigns it or generate anotger one
  function createWithId(username, userId){
    
    //we try to create the user with the generated id
    try{
      new User(username, userId);
      return userId;
      
    //if the id is already used we catch the exeption and try with another one
    } catch(e){
      var userId = shortid.generate();
      createWithId(username,userId);
    }
  }
  
  userId = createWithId(username, userId);
  return userId;
}

function createUserOnRequest(req, resp, next){
  if(req.body.username){
      var userId = createUser(req.body.username);
      resp.locals.userId = userId;
      next();

  } else {
     resp.status(400).send({
      error: "missing username parameter"
    }); 
  }
}



//ROOM CREATION

//function called to create a room
function createRoom(creatorId){
  
  //we generate a random id for the room
  var roomId = shortid.generate();
  
  //intern recursive function called to create a room and verify that the id is not taken
  function createWithId(creatorId, roomId){
    
    //we try to create the room with the id we generated
     try{
       var room = new Room(roomId, creatorId);
       return room.roomId;
       
       //if it doesn't work it means that the id is taken so we generate a new one and call the function again
     } catch(e){
       roomId = shortid.generate();
       createWithId(creatorId, roomId);
     }
  }
  
  //we call the recursive function
  roomId = createWithId(creatorId, roomId);
  return roomId;
}

//function called by the endpoint to create a room
function createRoomOnRequest(req,resp){
  var creatorId = resp.locals.userId;
  var roomId = createRoom(creatorId);
  let roomCreationDAO = new RoomCreationDAO(roomId, creatorId);
  resp.status(201).send(roomCreationDAO);
}


//JOIN ROOM
function joinRoomOnRequest(req,resp){
  if(req.params.id){
    
      if(req.params.id in Room.rooms){
        Room.rooms[req.params.id].addPlayer(resp.locals.userId);
        resp.status(200).send(resp.locals.userId);
      } else {
        resp.status(404).send({error: "The room you asked for does not exist"});
      }

  } else {
     resp.status(400).send({
      error: "missing room id parameter"
    }); 
  }  
}


// //TESTS
// createUser("Laure");
// createUser("Ladislas");
// console.log(User.users);

