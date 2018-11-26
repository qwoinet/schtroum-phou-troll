<template>
  <div id="application" class="vue">
    <img src="https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frules.png?1541983837413" class="right pict">
      <div class="bigmargin">
        <h2>{{title}}</h2>

        <div class="simplepadding">
          <p>
            {{username}} vs. {{opponentname}}
          </p>
        </div>

        <div class="simplepadding flexinline">
            <span class="inline">
            <div>
              <p>
                You chose
              </p>
              <div class="choices">
                <img v-bind:src="userchoicepicture" class="choicesimg lightborder">
              </div>
                          
            </div>
            </span>
            
            <span class="inline">
              <div>
              <p>
                {{opponentname}} chose  
              </p>
              <div class="choices">
                <img v-bind:src="opponentchoicepicture" class="choicesimg lightborder"> 
              </div>                   
              </div>
            </span>
        </div>
        
        
            <div>
              <p>
                {{result}}  
              </p>  
            </div>
            <!--<input type="image" v-bind:id="choice.name" v-bind:alt="choice.name" v-bind:src="choice.url" v-on:click="chooseSign" style="height:100px; width:100px">-->

        <div class="simplepadding">
          <div class="buttonspacing">
            <button id="leave-room" v-on:click="leaveRoom" class="button">Leave game</button>
            <span v-if="resultgiven">
              <button id="play-game" v-on:click="playAgain" class="button">Play again</button>
            </span>
            <p class="saving"><span>.</span><span>.</span><span>.</span></p>
          </div>
        </div>
    </div>
  </div>
</template>