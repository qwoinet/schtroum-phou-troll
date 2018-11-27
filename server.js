// server.js
// where your node app starts

// init project
var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

//if the port is defined in the env file then its value is used otherwise, port = 3000
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

//We send the index file when the user arrives 
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
  
  //we call the method that assigns it or generate another one
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
  //We use the recursive function previously defined
  userId = createWithId(username, userId);
  return userId;
}

//Since users are created before the player chooses a username
//This function is called when the server is given a username
function updateUsername(username, userId){
    User.users[userId].username = username;
}

//Function called when someone joins a room or creates a room
//Both requests provide the server with the player'susername
//It allows us to update the player's User object that was created when his socket connected to the server
function updateUsernameOnRequest(req, resp, next){
  
  //If the username and the user id were provided, we proceed to the update
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

//We use another generator for the room ids because shortid generator gives room ids
//that are very difficult to give to another human being
function generateRandomRoomNumber(){
  var i = Math.floor(Math.random() * 10000);
  return i;
}
                     

//function called to create a room
function createRoom(creatorId){
  
  //we generate a random id for the room
  //var roomId = shortid.generate();
  var roomId = generateRandomRoomNumber();
  
  //intern recursive function called to create a room and verify that the id is not taken
  function createWithId(creatorId, roomId){
    
    //we try to create the room with the id we generated
     try{
       var room = new Room(roomId, creatorId);
       return room.roomId;
       
       //if it doesn't work it means that the id is taken so we generate a new one and call the function again
     } catch(e){
       roomId = generateRandomRoomNumber();
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
  //we create a new room
  var roomId = createRoom(creatorId);
  let roomCreationDAO = new RoomCreationDAO(roomId, creatorId);
  User.users[req.body.userId].roomId = roomId;
  //We send a success response
  resp.status(201).send(roomCreationDAO);
}


//JOIN ROOM

//function called when a player wants to join a room, after his user object was created
function joinRoomOnRequest(req,resp){
  
  //If the rommId was provided in the request as a parameter in the url
  if(req.params.id){
    
      //If the roomId corresponds to a room that actually exists
      if(req.params.id in Room.rooms){
        try {
          //We add the player's id to the room's playersIds parameter
          Room.rooms[req.params.id].addPlayer(req.body.userId);
          
          //We send a success response
          resp.status(200).send({userId: req.body.userId});
          
          //We update the user's roomId parameter
          User.users[req.body.userId].roomId = req.params.id;
          
          //We broadcast a "join" message to all the other players in the room
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

//callback for when a client socket connects to the server
io.on('connection', function (socket) {
  //We create a new user without a username
  var userId = createUser("");
  //We "bind" the user to a new socket
  User.users[userId].socket = socket;
  //We give an id to the socket
  socket.id = userId;
  
  //When another socket connects to the server, we send it it's userId back
  socket.emit('userId',userId);
  
  //callback for when a player sends his choice
  socket.on('choice', function(choice){
    var user = User.users[socket.id];
    var room = Room.rooms[user.roomId];
    //We update the room's choices parameter (it keep tracks of all the player's choices during a round)
    room.choices[socket.id] = choice;
    //If all the players have made their choices we transmit the choices
    if(room.choicesAreMade()){
      shareChoices(user.roomId);
    }
    
  });
  //callback for when a user quits a room
  socket.on('quit',function(){
    var user = User.users[socket.id];
    //We transmit the message to the other users in the room
    //And we suppress the room (and update the other uses's roomId in accordance)
    sendQuitRoom(socket.id, user.roomId);
  });
  
  //callback for when a user is disconnected
  socket.on('disconnect', function () {
    var userId = socket.id;
    var user = User.users[userId];
    var room = Room.rooms[user.roomId];
    //If the user was in a room we transmit the quit message to all the other players in the room
    //And we delete the room (and update the other uses's roomId in accordance)
    if(user.roomId != "" ){
      sendQuitRoom(socket.id, user.roomId);
    }
    delete User.users[userId];
  });
  
  //callback on reception of an "again" message. The message should be transmitted to all
  //the other users in the room
  socket.on('again', function() {
    var user = User.users[socket.id];
    var room = Room.rooms[user.roomId];
    //We reinitilaize the room's choices parameter that keeps tracks of what the players 
    //chose during he round
    room.choices = {}
    //We transmit the again message to the other users in the room
    playAgainNotification(socket.id, user.roomId);
  });
            
});

/*
function called when both players have joined a room (the room is therefore full)
takes the id of the room they are both in
broadcasts a joined message to all the players in the room
*/
function broadcastToRoomFull(roomId){
  var room = Room.rooms[roomId];
  var usernames = [];
  //We construc a list of the usernames of the players in the room. The new player' id
  //has already been addes to the playersIds parameter of the room
  for(var i = 0;i< room.playersIds.length; i++){
    var userId = room.playersIds[i];
    usernames.push(User.users[userId].username); 
  }
  var body = {usernames : usernames};
  //We send the "join" message to all the other players in the room
  for(var i = 0; i < room.playersIds.length; i++){
    userId = room.playersIds[i];
    User.users[userId].socket.emit('joined',body); 
  }
}

/*
Function called when both players of a room have made their choice
roomId is the id of the room they are in
it returns nothing 
but send the choice of player 1 to player 2 and vice versa
*/
function shareChoices(roomId){
  var room = Room.rooms[roomId];
  //We share the choices of each player in the room to all the other players
  for (var player1 in room.choices){
    for (var player2 in room.choices){
      if (player2 != player1){
       User.users[player2].socket.emit('choice', room.choices[player1]);
      }
    }
  }
}

/*
Function called when one of the users diconnects or quits the room
it sends a "quit" message to the other player so that he quits the room too
the room is then deleted
*/
function sendQuitRoom(userId, roomId){
  var room = Room.rooms[roomId];
  //We send "quit" to all the other players in the room
  for (var i = 0 ; i < room.playersIds.length ; i++){
    if (room.playersIds[i] != userId){
      var socket = User.users[room.playersIds[i]].socket;
      socket.emit('quit');      
    }
    //We trinitialise the roomId parameter of all the other users in the room
    User.users[room.playersIds[i]].roomId = "";
  }
  //Then we delete the room
  delete Room.rooms[roomId];
}

/*
Function called when a user want to play again
it send the play again message to the other player
*/
function playAgainNotification(senderId, roomId){
  var room = Room.rooms[roomId];
  //we send the message "again" to all the other players in the room
  for (var i = 0 ; i < room.playersIds.length ; i++){
    if (room.playersIds[i] != senderId){
      var socket = User.users[room.playersIds[i]].socket;
        socket.emit('again');
    }
  }
}


// listen for requests :)

//Try this to see the port when the server starts listening
// const listener = server.listen(port, function() {
//   console.log('Your app is listening on port ' + listener.address().port);
// });

server.listen(port);
  
// //TESTS
// createUser("Laure");
// createUser("Ladislas");
// console.log(User.users);

