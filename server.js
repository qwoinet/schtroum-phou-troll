// server.js
// where your node app starts

// init project
var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;


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
      - userId : the id of the user that created the room
      
    returns :
      - status 201 + RoomCreationDAO : object containing :
        roomId : the id of the room that was generated
        userId : the id of the user that created the room
        
      OR
      
      - status 400 if the username parameter is missing
*/
app.post("/create-room", [updateUsernameOnRequest, createRoomOnRequest]);

/*
  endpoint used when a player clicks on the join game button
    - the path must contain the id of the room the player wants to join
    - the body must contain 
      - username
      - userId : the id of the user that created the room
    example : the request should be addressed to https://schtroum-phou-troll.glitch.me/656546545
    
    returns :
      - status 200 + user id of the new player
      
      OR
      
      - status 400 and message missing parameter if the room was not given in the path
      
      OR
      
      - status 404 if the room id is incorrect
      
      OR
      
      - status 402 if the room is full
*/
app.post("/:id", [updateUsernameOnRequest, joinRoomOnRequest]);



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

function updateUsername(username, userId){
    User.users[userId].username = username;
}

function updateUsernameOnRequest(req, resp, next){
  if(req.body.username && req.body.userId){
      var userId = updateUsername(req.body.username, req.body.userId);
      next();

  } else {
     resp.status(400).send({
      error: "missing username or userId parameter"
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
  var creatorId = req.body.userId;
  var roomId = createRoom(creatorId);
  let roomCreationDAO = new RoomCreationDAO(roomId, creatorId);
  resp.status(201).send(roomCreationDAO);
}


//JOIN ROOM
function joinRoomOnRequest(req,resp){
  if(req.params.id){
    
      if(req.params.id in Room.rooms){
        try {
          Room.rooms[req.params.id].addPlayer(req.body.userId);
          resp.status(200).send({userId: resp.locals.userId});
          if(Room.rooms[req.params.id].isFull()){
            broadcastToRoomFull(req.params.id);
          }
        }
        catch(e){
            resp.status(402).send({error: "The room you asked for is full"});
        }
        
      } else {
        resp.status(404).send({error: "The room you asked for does not exist"});
      }

  } else {
     resp.status(400).send({
      error: "missing room id parameter"
    }); 
  }  
}


//SOCKETS

io.on('connection', function (socket) {
  //console.log("connection");
  var userId = createUser("");
  User.users[userId].socket = socket;
  socket.id = userId;
  
  socket.emit('userId',userId);
  //console.log(userId);
  
  
  socket.on('disconnect', function () {
    var userId = socket.id;
    var user = User.users[userId];
    var room = Room.rooms[user.roomId];
    if(user.roomId != "" && room.playersIds.length==1){
      delete Room.rooms[user.roomId];
    }
    delete User.users[userId];
    //console.log("disconnection");
  });
});

function broadcastToRoomFull(roomId){
  var room = Room.rooms[roomId];
  var usernames = [];
  for(var i = 0;i< room.playersIds.length; i++){
    var userId = room.playersIds[i];
    usernames.push(User.users[userId].username); 
  }
  var body = {usernames : usernames};
  for(var i = 0; i < room.playersIds.length; i++){
    userId = room.playersIds[i];
    User.users[userId].socket.emit('joined',body); 
  }
}

// listen for requests :)
// const listener = app.listen(port, function() {
//   console.log('Your app is listening on port ' + listener.address().port);
// });

server.listen(port);
  
// //TESTS
// createUser("Laure");
// createUser("Ladislas");
// console.log(User.users);

