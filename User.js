class User {
  constructor(username, userId) {
    
    //we assign a user id if it's not already in use
    if(userId in User.users){
      throw Error("userId already in use");
    } else {
      this.userId = userId;
    }
    
    //we assign a username
    this.username = username;
    
    //the room Id will be assigned later
    this.roomId = "";
    
    //we add the newly created user to the list of users
    User.users[userId]= this;
    
  }
  
  joinRoom(roomId){
    
    //we assign a new room
    this.roomId = roomId;
  }
}

//static variable that keeps track of the users
User.users = {};

module.exports = User;

// //SOME TESTS

// let user1 = new User("Laure", "53434354");
// try{
//   let user1bis = new User("Laure", "53434354");}
// catch(e){
//   console.log(e);
//    }
// let user2 = new User("Ladislas", "654654654");

// console.log(User.users);
