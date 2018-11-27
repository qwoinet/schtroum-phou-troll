//call a function with 1 argument
        // - username : this.username
        //expect 1 value (as a promise)
        // - {error: false, userid, roomid} or {error: true, error_msg}

async function sendCreationRequest(username){
  let returnValue = {};
  let response = await fetch('/create-room',{
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: 'username=' + username+"&userId="+ userId
  });
  let JSONResponse = await response.json();
  if(response.ok){
    returnValue.error = false ;
    returnValue.userid = JSONResponse.userId1;
    returnValue.roomid = JSONResponse.roomId;
    
  } else {
    returnValue.error = true ;
    returnValue.message = JSONResponse.error;
  }
  return returnValue;

}


//call a function with 2 arguments
        // - username : this.username
        // - roomid : this.roomid
        //expect 1 value
        // - {error: false, userid} or {error: true, error_msg}(as a promise)

async function sendJoinRequest(username, roomId){
  let returnValue = {};
  let response = await fetch(
    '/'+roomId,
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: 'username=' + username+"&userId="+ userId
    }
  );
  let JSONResponse = await response.json();
  if(response.ok){
    returnValue.error = false;
    returnValue.userid = JSONResponse.userId;
  } else {
    returnValue.error = true;
    returnValue.message = JSONResponse.error;
  }
  return returnValue;
  
}

//TESTS
//async function test1(){
// let result = await sendCreationRequest("");
// alert(result.message);
//  result = await sendCreationRequest("Laure");
//  alert(result.error);
// }

//test1();

//async function test2(){
//  let result = await sendJoinRequest("Laure","mGWA3ramqo");
//  alert(result.error);
//  result = await sendJoinRequest("","m0UwHJSCpV");
//  alert(result.message);
//  result = await sendJoinRequest("Laure","6545");
//  alert(result.message);
//}

//test2();


// function test(nombre){
//   let test2 = {};
//   switch(nombre){
//     case 0:
//       // test2.error = true;
//       // return {error: true};
//       test2["error"] = true;
//     case 1:
//       // test2.message = "kjbjjgkg";
//       // return {message: "kdjfhqlksjdfkb"}
//       test2["message"] = "cghsfhsdfgdg";
//     default: 
//       // return {};
//  }
//   return test2;

// }

// alert(test(1).message);