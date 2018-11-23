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
