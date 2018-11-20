const socket = io();
var userId = "";


socket.on('userId',function(data){
  userId = data;
});
/*
socket.on('joined',function(data){
    alert('got socket "joined" old');
});
/**/
function bind_with_socket_joined(functionName){
  socket.on('joined',functionName);
}

bind_with_socket_joined(function(data){
    alert('got socket "joined" old');
});