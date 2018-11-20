

/* TO DELETE

// client-side js
// run by the browser each time your view template is loaded

// define variables that reference elements on our page
const firstForm = document.forms[0];
const firstDiv = document.getElementById("first-div");
const secondDiv = document.getElementById("second-div");
const usernameInput = firstForm.elements['username'];
const createButton = firstForm.elements['create-room'];
const joinButton = firstForm.elements['join-room'];

createButton.onclick = function(event){

  fetch('/create-room',{
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: 'username='+usernameInput.value
  }).then(function(response){
    //reponse à notre appel
    if(response.ok){
      response.json().then(function(object){
        console.log(object.roomId);
        console.log(object.userId1);
        
        alert("your room is number "+object.roomId + ", we are waiting for the other player");
        alert("you can invite him using this link: https://schtroum-phou-troll.glitch.me/"+object.roomId);
        });
    } else {
      alert("Error happened");
      alert ("waiting for another player");
    }
  });
  
  // reset form 
  usernameInput.value = '';
}

joinButton.onclick = function(event){
  // reset form 
  usernameInput.value = '';
  firstDiv.setAttribute("hidden", "");
  secondDiv.removeAttribute("hidden");
  
  
}
// listen for the form to be submitted and add a new dream when it is
firstForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();
};
*/

/**/

import Vue from 'vue'
import Requests from './requetes.js'
import ManageSockets from './manageSockets.js'

import vue_choose_name from './views/choose_name.vue'
import vue_choose_room from './views/choose_room.vue'
import vue_connect from './views/connect.vue'
import vue_waiting_room from './views/waiting_room.vue'
import vue_game_choose_sign from './views/game_choose_sign.vue'
import vue_game_waiting_opponent from './views/game_waiting_opponent.vue'


//
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
        this.username = event.target.value;
      },
      validateUsername: function(event){
        event.preventDefault();
        if(this.username == ''){
          alert("The following information is missing : username");
          return;
        }
        goto_choose_room(this.username);
      }
    }
  });
}

//
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
        this.roomid = event.target.value;
      },
      joinRoom: function(event){
        event.preventDefault();
        if(this.username == ''){
          alert("The following information is missing : username");
          goto_choose_name();
          return;
        }
        if(this.roomid == ''){
          alert("The following information is missing : room Id");
          return;
        }
        //call a function with 2 arguments
        // - username : this.username
        // - roomid : this.roomid
        //expect 1 object
        // - {error: false, userid} or {error: true, error_msg}
        // var res = {error: false, userid: 4};
        var res_promice = Requests.sendJoinRequest(this.username, this.roomid);
        var myusername = this.username;
        var myroomid = this.roomid;
        res_promice.then(function(res){
          if(res.error){
            alert(res.error_msg);
          }
          else{
            goto_waiting_room(myusername, res.userid, myroomid);
          }
        });
      },
      createRoom: function(event){
        event.preventDefault();
        if(this.username == ''){
          alert("The following information is missing : username");
          return;
        }
        //call a function with 1 argument
        // - username : this.username
        //expect 1 object
        // - {error: false, userid, roomid} or {error: true, error_msg}
        //var res = {error: false, userid: 4, roomid: 3};
        var res_promice = Requests.sendCreationRequest(this.username);
        var myusername = this.username;
        res_promice.then(function(res){
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


// Entrance page of the application
// Define username and create/join a room
/**
function goto_connect(){
  //var current_vue = new Vue(vue_connect);
  //current_vue.setAttributes(goto_list);
  //current_vue.$mount('#application');
  
  new Vue({
    el: '#application',
    template: vue_connect.template,
    data: {
      username: '',
      title: 'Front unique',
      roomid: '',
      goto_connect: true,
    },
    methods: {
      updateUsername: function(event){
        event.preventDefault();
        this.username = event.target.value;
      },
      createRoom: function(event){
        event.preventDefault();
        if(this.username == ''){
          alert("The following information is missing : username");
          return;
        }
        //call a function with 1 argument
        // - username : this.username
        //expect 1 object
        // - {error: false, userid, roomid} or {error: true, error_msg}
        var res = {error: false, userid: 4, roomid: 3};
        //var res = Requests.sendCreationRequest(this.username);
        if(res.error){
          alert(res.error_msg);
        }
        else{
          this.goto_connect = false;
          goto_waiting_room(this.username, res.userid, res.roomid);
        }
      },
      updateRoomId: function(event){
        event.preventDefault();
        this.roomid = event.target.value;
      },
      joinRoom: function(event){
        event.preventDefault();
        if(this.username == ''){
          alert("The following information is missing : username");
          return;
        }
        if(this.roomid == ''){
          alert("The following information is missing : room Id");
          return;
        }
        //call a function with 2 arguments
        // - username : this.username
        // - roomid : this.roomid
        //expect 1 object
        // - {error: false, userid} or {error: true, error_msg}
        var res = {error: false, userid: 4};
        if(res.error){
          alert(res.error_msg);
        }
        else{
          this.goto_connect = false;
          goto_waiting_room(this.username, res.userid, this.roomid);
        }
      },
    },
  });
  
}
/**/

// Waiting room
// Wait for other players to join
function goto_waiting_room(username, userid, roomid){
  //alert("goto_waiting_room");
  /**/
  //ManageSockets.socket.on('joined',function(data){
  //  alert('got socket "joined" new');
    //ManageSockets.bind_with_socket_joined(function(data){});
    //var JSONdata = data.json();
    //JSONdata.then(function(resdata){
    //  alert(resdata);
      // resdata.usernames => transformation !!!!
      //goto_game_choose_sign(username, userid, roomid, resdata.usernames);
    //});
    
  //});
  /**/
  
  /**/
  ManageSockets.bind_with_socket_joined(function(data){
    alert('got socket "joined" new');
  });
  /**/
  new Vue({
    el: '#application',
    template: vue_waiting_room.template,
    data:{
      username: username,
      userid: userid,
      roomid: roomid,
    },
    methods:{
      leaveRoom: function(event){
        event.preventDefault();
        goto_choose_room(this.username);
      },
      /**/
      playInRoom: function(event){
        event.preventDefault();
        goto_game_choose_sign(this.username, this.userid, this.roomid, 'your opponent');
      },
      /**/
    },
  });
}

// Playing room
// Choose the sign to use
function goto_game_choose_sign(username, userid, roomid, opponentname){
  new Vue({
    el: '#application',
    template: vue_game_choose_sign.template,
    data:{
      choices:[
        {name: "rock", url: 'https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frock.png?1541956335451'},
        {name: "paper", url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Fpaper.png?1541956335380"},
        {name: "scissors", url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Fscissors.png?1541956335262"},
        //{name: "lizard", url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Flizard.png?1541956335285"},
        //{name: "spock", url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Fspock.png?1541956335215"},
        ],
      title: "Game's on",
      username: username,
      userid: userid,
      roomid: roomid,
      opponentname: opponentname,
    },
    methods:{
      chooseSign: function(event){
        event.preventDefault();
        //alert(event.target.id);
        goto_game_waiting_opponent(this.username, this.userid, this.roomid, this.opponentname, event.target.id);
      },
    },
  });
}

//
//
function goto_game_waiting_opponent(username, userid, roomid, opponentname, userchoice){
  alert(userchoice);
  var currentvue = new Vue({
    el: '#application',
    template: vue_game_waiting_opponent.template,
    data: {
      choices:[
        {name: "rock", url: 'https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frock.png?1541956335451'},
        {name: "paper", url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Fpaper.png?1541956335380"},
        {name: "scissors", url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Fscissors.png?1541956335262"},
        {name: "lizard", url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Flizard.png?1541956335285"},
        {name: "spock", url: "https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Fspock.png?1541956335215"},
        ],
      title: "Waiting",
      username: username,
      userid: userid,
      roomid: roomid,
      userchoice: userchoice,
      userchoicepicture: 'https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Fspock.png?1541956335215', //this.getPictureFromSign(userchoice),
      opponentname: opponentname,
      opponentchoice: '',
      opponentchoicepicture: '',
    },
    methods:{
      getPictureFromSign: function(sign){
        for(var choice in this.choices){
          if(choice.name == sign){
            return choice.url;
          }
          return '';
        }
      },
    },
  });
  //currentvue.$userchoicepicture = currentvue.$getPictureFromSign(currentvue.$userchoice);
}

goto_choose_name();

