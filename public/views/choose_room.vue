<template>
  <div id="application" class="vue">
    <div>
      <div>
        <!-- rules image -->
        <img src="https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frules.png?1541983837413" class="right pict">
        <div class="halfscreenPC">
          
        <!-- 'title'-->
        <h2 class="title">Hello {{username}}</h2>
        <form v-on:submit="createRoom">
          <div class="buttonspacing"><button id="create-room" v-on:click="createRoom" class="button">Create a room</button></div>
        </form>
        <form v-on:submit="joinRoom">
          <!-- roomid input -->
          <div class="topmarging buttonspacing"><input  class="smallbox lightborder" name="roomId" maxlength="100" placeholder="room Id" aria-labelledby="submit-id" required v-on:input="updateRoomId"/></div>
          <!-- roomid button -->
          <div class="buttonspacing"><button id="join-room" v-on:click="joinRoom" class="button">Join game</button></div>
        </form>
          </div>
      </div>
    </div>
  </div>
</template>
