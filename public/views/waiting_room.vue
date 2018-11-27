<template>
  <div id="application" class="vue">
    <img src="https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frules.png?1541983837413" class="right pict smallremove">
      <div>
        <h2>Waiting room</h2>

        <div class="simplepadding">
          <div>
            <p>Hello {{username}} you are in room <a v-on:click="copy(this)" class="roomid" id="toCopy" ><b><u>{{roomid}}</u></b></a> !</p>
            <p>{{waiting_msg}}</p>
            <p class="saving"><span>.</span><span>.</span><span>.</span></p>
          </div>
        </div>

        <div class="simplepadding">
          <div class="buttonspacing">
            <button id="leave-room" v-on:click="leaveRoom" class="button">Leave game</button>
          </div>
        </div>
    </div>
  </div>
</template>

