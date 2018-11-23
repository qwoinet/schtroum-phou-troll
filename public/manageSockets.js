const socket = io();
var userId = "";

socket.on('userId',function(data){
  userId = data;
});


//
// Socket 'joined'
//

var socket_joined = {received: false, data: {}};
var functionToCall_joined = function(data){};

function set_functionToCall_joined(newFunction){
  functionToCall_joined = newFunction;
}

function reset_functionToCall_joined(){
  set_functionToCall_joined(function(data){});
}
function wait_for_socket_joined(){
  socket_joined.received = false;
  socket_joined.data = {};
  reset_functionToCall_joined();
}

socket.on('joined',function(data){
  socket_joined.received = true;
  socket_joined.data = data;
  functionToCall_joined(data);
});



//
// Socket 'choice'
//

//function called when the player has made his choice. 
//It sends said choice to the server
//Choice should be one of the possibilities of ChoiceEnum
function play(choice){
  socket.emit('choice', choice); 
  //alert("I played "+choice);
}

var socket_choice = {received: false, data: {}};
var functionToCall_choice = function(data){};

function set_functionToCall_choice(newFunction){
  functionToCall_choice = newFunction;
}
function reset_functionToCall_choice(){
  set_functionToCall_choice(function(data){});
}
function wait_for_socket_choice(){
  socket_choice.received = false;
  socket_choice.data = {};
  reset_functionToCall_choice();
}
socket.on('choice',function(data){
  socket_choice.received = true;
  socket_choice.data = data;
  functionToCall_choice(data);
});




//
// Socket 'quit'
//

function quit_room(){
  socket.emit('quit');
}

var socket_quit = {received: false};
var functionToCall_quit = function(){};

function set_functionToCall_quit(newFunction){
  functionToCall_quit = newFunction;
}
function reset_functionToCall_quit(){
  set_functionToCall_quit(function(){});
}
function wait_for_socket_quit(){
  socket_quit.received = false;
  reset_functionToCall_quit();
}
//triggered when the other player quits and the room is deleted on the server side
socket.on('quit',function(){
  socket_quit.received = true;
  functionToCall_quit();
});


/*
//triggered when the other player quits and the room is deleted on the server side
socket.on('quit', function(){
  console.log("the other player quit");
});
*/

//
// Socket 'again'
//

function again(){
  socket.emit('again');
}

var socket_again = {received: false};
var functionToCall_again = function(){};

function set_functionToCall_again(newFunction){
  functionToCall_again = newFunction;
}
function reset_functionToCall_again(){
  set_functionToCall_again(function(){});
}
function wait_for_socket_again(){
  socket_again.received = false;
  reset_functionToCall_again();
}
//triggered when the other player want to play again
socket.on('again',function(){
  //alert("received socket 'again'");
  socket_again.received = true;
  functionToCall_again();
});





/*
//triggered when the other player want to play again
socket.on('again', function(){
  console.log("the other player want an other round");
});

//function called when the player choose to play again or not
//Itsends said choice to the server
function again(choice){
  socket.emit('again', choice);
}

*/