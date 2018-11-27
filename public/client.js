

import Vue from 'vue'
import Requests from './requetes.js'
import ManageSockets from './manageSockets.js'

import vue_choose_name from './views/choose_name.vue'
import vue_choose_room from './views/choose_room.vue'
//import vue_connect from './views/connect.vue'
import vue_waiting_room from './views/waiting_room.vue'
import vue_game_choose_sign from './views/game_choose_sign.vue'
import vue_game_waiting_opponent from './views/game_waiting_opponent.vue'


//
//
var currentVersion = 3;

var ChoicesEnum = {
  ROCK: 0,
  PAPER: 1,
  SICCORS: 2,
  LIZARD: 3,
  SPOCK: 4,
};

var ChoicesDesc = [
  {
    name: "rock", 
    value: ChoicesEnum.ROCK,
    url: 'https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frock.png?1541956335451',
    beats: function(against){ return against == ChoicesEnum.LIZARD || against == ChoicesEnum.SICCORS; },
  },
  {
    name: "paper", 
    value: ChoicesEnum.PAPER,
    url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Fpaper.png?1541956335380",
    beats: function(against){ return against == ChoicesEnum.ROCK || against == ChoicesEnum.SPOCK; },
  },
  {
    name: "scissors", 
    value: ChoicesEnum.SICCORS,
    url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Fscissors.png?1541956335262",
    beats: function(against){ return against == ChoicesEnum.PAPER || against == ChoicesEnum.LIZARD; },
  },
  {
    name: "lizard", 
    value: ChoicesEnum.LIZARD,
    url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Flizard.png?1541956335285",
    beats: function(against){ return against == ChoicesEnum.PAPER || against == ChoicesEnum.SPOCK; },
  },
  {
    name: "spock", 
    value: ChoicesEnum.SPOCK,
    url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Fspock.png?1541956335215",
    beats: function(against){ return against == ChoicesEnum.ROCK || against == ChoicesEnum.SICCORS; },
  },
];
//
//

/*
//
//Enum that describes the choices a player can make
//To know if the client beat the other player just compare the other player's
//choice with rules[<choice other player>].beats
var ChoicesEnum = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3,
};
//rules describing the game
var rules =  {
    1: {name: "rock", beats: ChoicesEnum.SCISSORS},
    2: {name: "paper", beats: ChoicesEnum.ROCK},
    3: {name: "scissors", beats: ChoicesEnum.PAPER}
  };
*/

/*
  function that returns wether or not the client is the winner
  given his choice (myChoice) ant the other player's choice (otherPlayerChoice)
*/
/*
function isWinner(otherPlayerChoice, myChoice){
  if ( myChoice == otherPlayerChoice ){
    //What happens ??? => draw : no points
    return undefined;
  } else {
    return ChoicesDesc[myChoice].beats(otherPlayerChoice) ;
  }
}
*/

// First step : the user chooses its name
//
function goto_choose_name(){
  new Vue({
    el: '#application',
    template: vue_choose_name.template,
    data: {
      username: '', 
    },
    methods: {
      updateUsername: function(event){
        event.preventDefault();
        // updates
        this.username = event.target.value;
      },
      validateUsername: function(event){
        event.preventDefault();
        // tests the data
        if(this.username == ''){
          alert("The following information is missing : username");
          return;
        }
        goto_choose_room(this.username);
      }
    }
  });
}

// Second step : the user chooses its room
//
function goto_choose_room(username){
  new Vue({
    el: '#application',
    template: vue_choose_room.template,
    data: {
      username: username,
      roomid: '',
    },
    methods: {
      updateRoomId: function(event){
        event.preventDefault();
        // updates
        this.roomid = event.target.value;
      },
      joinRoom: function(event){
        event.preventDefault();
        // tests the data
        if(this.username == ''){
          alert("The following information is missing : username");
          goto_choose_name();
          return;
        }
        if(this.roomid == ''){
          alert("The following information is missing : room Id");
          return;
        }
        // prepare socket listener
        ManageSockets.wait_for_socket_joined();
        // send join request
        var res_promice = Requests.sendJoinRequest(this.username, this.roomid);
        var myusername = this.username;
        var myroomid = this.roomid;
        // get answer
        res_promice.then(function(res){ // res = {error: false, userid} or {error: true, error_msg}
          if(res.error){
            alert(res.message);
          }
          else{
            goto_waiting_room(myusername, res.userid, myroomid);
          }
        });
      },
      createRoom: function(event){
        event.preventDefault();
        // tests the data
        if(this.username == ''){
          alert("The following information is missing : username");
          return;
        }
        // prepare socket listener
        ManageSockets.wait_for_socket_joined();
        // send creation request
        var res_promice = Requests.sendCreationRequest(this.username);
        var myusername = this.username;
        // get answer
        res_promice.then(function(res){ // res = {error: false, userid, roomid} or {error: true, error_msg}
          if(res.error){
            alert(res.error_msg);
          }
          else{
            goto_waiting_room(myusername, res.userid, res.roomid);
          }
        });
      },
      
    }
  });
}



// Waiting room
// Wait for other players to join
function goto_waiting_room(username, userid, roomid){
  var currentvue = new Vue({
    el: '#application',
    template: vue_waiting_room.template,
    data:{
      username: username,
      userid: userid,
      roomid: roomid,
      waiting_msg: 'Waiting for another player',
    },
    methods:{
      leaveRoom: function(event){
        event.preventDefault();
        goto_choose_room(this.username);
      },
      copy: function(){
        /*var copyText = roomid;
        copyText.select();*/
        var textArea = document.createElement("textArea");
        textArea.value = roomid
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      },
      handler_socket_joined(data){
        ManageSockets.reset_functionToCall_joined();
        // prepare socket listener
        ManageSockets.wait_for_socket_quit();
        ManageSockets.wait_for_socket_again();
        if(data.usernames[0] == this.username){
          goto_game_choose_sign(this.username, this.userid, 0, this.roomid, data.usernames[1], 0);
        }
        else{
          goto_game_choose_sign(this.username, this.userid, 0, this.roomid, data.usernames[0], 0);
        }
      },
    },
  });
  /*
  function handler_socket_joined(data){
    ManageSockets.reset_functionToCall_joined();
    if(data.usernames[0] == username){
      goto_game_choose_sign(username, userid, roomid, data.usernames[1]);
    }
    else{
      goto_game_choose_sign(username, userid, roomid, data.usernames[0]);
    }
  }
  /**/
  if(ManageSockets.socket_joined.received){
    currentvue.handler_socket_joined(ManageSockets.socket_joined.data);
  }
  else{
    ManageSockets.set_functionToCall_joined(currentvue.handler_socket_joined);
  }
}

// Playing room
// Choose the sign to use
function goto_game_choose_sign(username, userid, userscore, roomid, opponentname, opponentscore){
  var currentvue = new Vue({
    el: '#application',
    template: vue_game_choose_sign.template,
    data:{
      choices: ChoicesDesc.slice(0, currentVersion),
      title: "Game's on",
      username: username,
      userid: userid,
      userscore: userscore,
      roomid: roomid,
      opponentname: opponentname,
      opponentscore: opponentscore,
    },
    methods:{
      chooseSign: function(event){
        event.preventDefault();
        // prepare socket listener
        ManageSockets.wait_for_socket_choice();
        ManageSockets.wait_for_socket_again();
        // send choice socket
        ManageSockets.play(event.target.id);
        goto_game_waiting_opponent(this.username, this.userid, this.userscore, this.roomid, this.opponentname, this.opponentscore, event.target.id);
      },
      handler_socket_quit: function(){
        ManageSockets.reset_functionToCall_choice();
        ManageSockets.reset_functionToCall_quit();
        alert("Your opponent quitted");
        goto_choose_room(this.username);
      },
    },
  });
  
  
  if(ManageSockets.socket_quit.received){
    currentvue.handler_socket_quit();
  }
  else{
    ManageSockets.set_functionToCall_quit(currentvue.handler_socket_quit);
  }
}

//
//
function goto_game_waiting_opponent(username, userid, userscore, roomid, opponentname, opponentscore, userchoice){
  //alert(userchoice);
  var currentvue = new Vue({
    el: '#application',
    template: vue_game_waiting_opponent.template,
    data: {
      choices: ChoicesDesc,
      title: "Waiting",
      username: username,
      userid: userid,
      roomid: roomid,
      userchoice: userchoice,
      userchoicepicture: ChoicesDesc[userchoice].url,
      userscore: userscore,
      opponentname: opponentname,
      opponentchoice: '',
      opponentchoicepicture: '',
      opponentscore: opponentscore,
      result: '',
      resultgiven: false,
    },
    methods:{
      leaveRoom: function(event){
        //alert("You quit");
        event.preventDefault();
        ManageSockets.reset_functionToCall_choice();
        ManageSockets.reset_functionToCall_quit();
        ManageSockets.quit_room();
        goto_choose_room(this.username);
      },
      playAgain: function(event){
        event.preventDefault();
        ManageSockets.reset_functionToCall_choice();
        ManageSockets.reset_functionToCall_quit();
        ManageSockets.again();
        goto_waiting_room_again(this.username, this.userid, this.userscore, this.roomid, this.opponentname, this.opponentscore);
      },
      handler_socket_choice: function(data){
        ManageSockets.reset_functionToCall_choice();
        this.opponentchoice = data;
        this.opponentchoicepicture = ChoicesDesc[this.opponentchoice].url;
        if(ChoicesDesc[this.userchoice].beats(this.opponentchoice)){
          this.result = 'You won';
          this.userscore += 1;
        }
        else if(ChoicesDesc[this.opponentchoice].beats(this.userchoice)){
          this.result = 'You lost';
          this.opponentscore += 1;
        }
        else{
          this.result = 'equality';
        }
        this.resultgiven = true;
      },
      handler_socket_quit: function(){
        ManageSockets.reset_functionToCall_choice();
        ManageSockets.reset_functionToCall_quit();
        alert("Your opponent quitted");
        goto_choose_room(this.username);
      },
    },
  });
  //currentvue.$userchoicepicture = currentvue.$getPictureFromSign(currentvue.$userchoice);
  
  if(ManageSockets.socket_choice.received){
    currentvue.handler_socket_choice(ManageSockets.socket_choice.data);
  }
  else{
    ManageSockets.set_functionToCall_choice(currentvue.handler_socket_choice);
  }
  
  if(ManageSockets.socket_quit.received){
    currentvue.handler_socket_quit();
  }
  else{
    ManageSockets.set_functionToCall_quit(currentvue.handler_socket_quit);
  }
  
}



// Waiting room
// Wait for other players to join
function goto_waiting_room_again(username, userid, userscore, roomid, opponentname, opponentscore){
  var currentvue = new Vue({
    el: '#application',
    template: vue_waiting_room.template,
    data:{
      username: username,
      userid: userid,
      userscore: userscore,
      roomid: roomid,
      opponentname: opponentname,
      opponentscore: opponentscore,
      waiting_msg: 'Waiting for ' + opponentname + '...',
    },
    methods:{
      leaveRoom: function(event){
        event.preventDefault();
        ManageSockets.quit_room();
        goto_choose_room(this.username);
      },
      
      handler_socket_quit: function(){
        ManageSockets.reset_functionToCall_quit();
        ManageSockets.reset_functionToCall_again();
        alert("Your opponent quitted");
        goto_choose_room(this.username);
      },
      
      handler_socket_again: function(){
        ManageSockets.reset_functionToCall_quit();
        ManageSockets.reset_functionToCall_again();
        goto_game_choose_sign(this.username, this.userid, this.userscore, this.roomid, this.opponentname, this.opponentscore);
      },
      
      copy: function(){
        /*var copyText = roomid;
        copyText.select();*/
        var textArea = document.createElement("textArea");
        textArea.value = roomid
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      },
    },
  });
  
  if(ManageSockets.socket_quit.received){
    currentvue.handler_socket_quit();
  }
  else{
    ManageSockets.set_functionToCall_quit(currentvue.handler_socket_quit);
  }
  
  if(ManageSockets.socket_again.received){
    currentvue.handler_socket_again();
  }
  else{
    ManageSockets.set_functionToCall_again(currentvue.handler_socket_again);
  }
  
}


goto_choose_name();

