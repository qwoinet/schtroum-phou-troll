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
// Entrance page of the application
// Define username and create/join a room
function goto_connect(){
  new Vue({
    el: '#application',
    template:`
      <div id="application" style="width:90%; border:solid">
        <h2>{{title}}</h2>

        <form v-on:submit="createRoom" style="padding:10px; max-width:100%; background-color:white">
          <div style="border:solid">
            <input type="text" name="username" maxlength="100" placeholder="username" aria-labelledby="submit-username" required v-on:input="updateUsername" style="padding:10px"/>
          </div>
        </form>

        <div style="padding:10px">
          <div style="border:solid">
            <button id="create-room" v-on:click="createRoom" style="margin:10px">Create a room</button>
          </div>
        </div>

        <form v-on:submit="joinRoom" style="padding:10px; max-width:100%; background-color:white">
          <div style="border:solid">
            <input name="roomId" maxlength="100" placeholder="room Id" aria-labelledby="submit-id" required v-on:input="updateRoomId" style="padding:10px"/>
            <button id="join-room" v-on:click="joinRoom" style="margin:10px">Join game</button>
          </div>
        </form>
      </div>`,
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
        //expect 1 value
        // - {error: false, userid, roomid} or {error: true, error_msg}
        var res = {error: false, userid: 4, roomid: 3};
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
        //expect 1 value
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

// Waiting room
// Wait for other players to join
function goto_waiting_room(username, userid, roomid){
  //alert("function : goto_waiting_room");
  new Vue({
    el: '#application',
    template:`
      <div id="application" style="width:90%; border:solid">
        <h2>{{title}}</h2>

        <div style="padding:10px">
          <div style="border:solid">
            <p>Hello {{username}}({{userid}}), you are in the room {{roomid}} !</p>
          </div>
        </div>

        <div style="padding:10px">
          <div style="border:solid">
            <button id="leave-room" v-on:click="leaveRoom" style="margin:10px">Leave game</button>
          </div>
        </div>
      </div>`,
    data:{
      username: username,
      userid: userid,
      roomid: roomid,
      goto_waiting_room: true,
      goto_connect: false,
    },
    methods:{
      leaveRoom: function(event){
        event.preventDefault();
        goto_connect();
      },
    },
  });
}

// Playing room
// Choose the sign to use
function goto_game_choose_sign(){
  new Vue({
    el: '#application',
    template: `
      <div id="application">

        <h2>{{title}}</h2>

        <div>
          
          <input id="rock" type="image">
        </div>
      </div>`,
    data:{
      
    },
    methods:{
    },
  });
}


goto_connect();


/**/

/**

var current_vue = new Vue({el: '#application', data: {}, methods: {}});

function goto_connect(){
  current_vue.data = {
    username: '',
    title: 'Front unique',
    roomid: '',
    goto_connect: true,
  };
  current_vue.methods = {
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
      //expect 1 value
      // - {error: false, userid, roomid} or {error: true, error_msg}
      var res = {error: false, userid: 4, roomid: 3};
      if(res.error){
        alert(res.error_msg);
      }
      else{
        //this.goto_connect = false;
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
      //expect 1 value
      // - {error: false, userid} or {error: true, error_msg}
      var res = {error: false, userid: 4};
      if(res.error){
        alert(res.error_msg);
      }
      else{
        //this.goto_connect = false;
        goto_waiting_room(this.username, res.userid, this.roomid);
      }
    },
  };
}

function goto_waiting_room(username, userid, roomid){
  //alert("function : goto_waiting_room");
  current_vue.data = {
    username: username,
    userid: userid,
    roomid: roomid,
    goto_waiting_room: true,
  };
  current_vue.methods = {
    leaveRoom: function(event){
      event.preventDefault();
      goto_connect();
    },
  };
}

goto_connect();

/**/