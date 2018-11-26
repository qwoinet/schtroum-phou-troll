<template>
  <div id="application" class="vue">
    
      <div class="simlepadding bigmargin">
        <img src="https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frules.png?1541983837413" class="right pict">
          
        <h2>{{title}}</h2>

        <div class="simplepadding">
          <p>
            {{username}} vs. {{opponentname}}
          </p>
        </div>

        <div class="simplepadding">
          <span v-for="choice in choices" class="choices inline">
            <input type="image" v-bind:id="choice.value" v-bind:alt="choice.name" v-bind:src="choice.url" v-on:click="chooseSign" class="choicesimg lightborder">
          </span>
        </div>

        <div class="simplepadding">
          <div class="buttonspacing">
            <!--<button id="leave-room" v-on:click="leaveRoom" class="button">Leave game</button>-->
            <!--<button id="play-game" v-on:click="playInRoom" class="button">Play game</button>-->
          </div>
        </div>
                    
    </div>
  </div>
</template>