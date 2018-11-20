<template>
  <div id="application" class="vue">
    <img src="https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frules.png?1541983837413" class="right pict">
        
        <h2>{{title}}</h2>

        <div style="padding:10px">
          <p>
            {{username}} vs. {{opponentname}}
          </p>
        </div>

        <div style="padding:10px">
          <span v-for="choice in choices">
            <input type="image" v-bind:id="choice.name" v-bind:alt="choice.name" v-bind:src="choice.url" v-on:click="chooseSign" style="height:100px; width:100px">
          </span>
        </div>

        <div style="padding:10px">
          <div class="buttonspacing">
            <!--<button id="leave-room" v-on:click="leaveRoom" class="button">Leave game</button>-->
            <!--<button id="play-game" v-on:click="playInRoom" class="button">Play game</button>-->
          </div>
        </div>
  </div>
</template>