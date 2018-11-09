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
  // reset form 
  usernameInput.value = '';
  
  
  fetch('/create-room',{
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: 'username='+usernameInput.value
  }).then(function(response){
    //reponse à notre appel
    if(response.ok){
      alert("room created");
    } else {
      alert("Error happened");
    }
  });
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
