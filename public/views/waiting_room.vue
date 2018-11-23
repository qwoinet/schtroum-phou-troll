<template>
  <div id="application" class="vue">
    <img src="https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frules.png?1541983837413" class="right pict">
        <h2>Waiting room</h2>

        <div style="padding:10px">
          <div>
            <p>Hello {{username}} you are in room {{roomid}} !</p>
            <p>{{waiting_msg}}</p>
          </div>
        </div>

        <div style="padding:10px">
          <div class="buttonspacing">
            <button id="leave-room" v-on:click="leaveRoom" class="button">Leave game</button>
          </div>
        </div>
  </div>
</template>

