class Room {
  constructor(roomId, creatorId) {
    
    //we assign a room id if it's not already in use
    if(roomId in Room.rooms){
      throw Error("roomId already in use");
    } else {
      this.roomId = roomId;
    }
    
    //we assign a username
    this.creatorId = creatorId;
    
    //A list containing the ids of the player in the room
    this.playersIds = [creatorId];
    
    //we add the newly created user to the list of users
    Room.rooms[roomId]= this;
    
  }
  
  //method that adds a player to the room
  addPlayer(playerId){
    if(this.isFull()){
      throw Error("Room already full");
    } else {
      this. playersIds.push(playerId);
    }
  }
  
  isFull(){
   if(this.playersIds.length >= 2){
     return true;
   }else{
    return false; 
   }
  }
}

//static variable that keeps track of the users
Room.rooms = {};

module.exports = Room;

// //Tests
// console.log("I create a first room");
// console.log(new Room("465464", "5454"));

// try{
//   console.log("I create a second room with same id");
//   console.log(new Room("465464", "5454"));
// }
// catch(e){
//   console.log(e);
// }

// console.log("I create a third room with correct id this time");
// console.log(new Room("kqsgfjsgdj", "5454"));

// console.log(Room.rooms);