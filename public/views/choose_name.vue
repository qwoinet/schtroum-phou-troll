<template>
  <div id="application" class="vue">
    <div class="simplepadding">
      <form v-on:submit="validateUsername">
        <div class="bigmargin">
        <!-- rules image -->
        <img src="https://cdn.glitch.com/b645b0f9-bdf9-4200-ae1c-de7e30968619%2Frules.png?1541983837413" class="right pict">
        <!-- 'title'-->
        <h2 class="title">Ready?</h2>

        <!-- username input -->
        <div><input class="smallbox lightborder" type="text" name="username" maxlength="100" placeholder="username" aria-labelledby="submit-username" required v-on:input="updateUsername"/></div>

        <!-- username button -->
        <div class="buttonspacing"><button id="create-room" v-on:click="validateUsername" class="button">Validate username</button></div>
        </div>
        
        
      </form>
    </div>
  </div>
</template>
