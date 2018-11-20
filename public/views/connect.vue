<template>
  <div id="application" class="vue">
    <div class="simplepadding">
      <form v-on:submit="createRoom">
        <div>
        <!-- rules image -->
        <img src="https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frules.png?1541983837413" class="right pict">
        <!-- 'title'-->
        <h2>{{title}}</h2>

        <!-- username input -->
        <div class="smallbox"><input type="text" name="username" maxlength="100" placeholder="username" aria-labelledby="submit-username" required v-on:input="updateUsername"/></div>

        <!-- username button -->
        <div class="buttonspacing"><button id="create-room" v-on:click="createRoom" class="button">Create a room</button></div>

        <!-- roomid input -->
        <div class="smallbox"><input name="roomId" maxlength="100" placeholder="room Id" aria-labelledby="submit-id" required v-on:input="updateRoomId"/></div>

        <!-- roomid button -->
        <div class="buttonspacing"><button id="join-room" v-on:click="joinRoom" class="button">Join game</button></div>
        </div>
      </form>
    </div>
  </div>
</template>



<script>
export default{
  data: {
      username: '',
      title: 'Front unique',
      roomid: '',
      goto_connect: true,
      goto_list: {}
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
          goto_list.goto_waiting_room(this.username, res.userid, res.roomid);
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
      setAttributes: function(goto_list){
        this.goto_list = goto_list;
      }
    }
}
</script>
