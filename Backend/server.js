const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { CheckWinner } = require("./utils/CheckWinner");
const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {

    // Initinaize a Romm is Does not exists
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [], // List of socket IDs
        scores: { X: 0, O: 0, Tie: 0 }
      };
    }

    //Prevent same user joining twice
    if (rooms[roomId].players.includes(socket.id)) return;

    //Check  room is full
   if (rooms[roomId].players.length >= 2) {
      socket.emit("room_full");
      return;
    }


    socket.join(roomId);     //Join and Assign Role
    rooms[roomId].players.push(socket.id);
    
    const role = rooms[roomId].players.length === 1 ? "X" : "O";
    socket.emit("player_role", role);


    // start game is 2 players are in
    if (rooms[roomId].players.length === 2) {
      //Pass the Scores to frontedn
      io.to(roomId).emit("start_game", { scores: rooms[roomId].scores });
    }
  });

  socket.on("make_move", ({ roomId, index, player }) => {

    if (!rooms[roomId]) return;

    // maintain board on server
    if (!rooms[roomId].board) {
      rooms[roomId].board = Array(9).fill(null);
    }

    rooms[roomId].board[index] = player;

    const result = CheckWinner(rooms[roomId].board);

    if (result) {
      if (result.winner === "X") rooms[roomId].scores.X += 1;
      if (result.winner === "O") rooms[roomId].scores.O += 1;
    } 
    else if (rooms[roomId].board.every(cell => cell !== null)) {
      rooms[roomId].scores.Tie += 1;
    }

    io.to(roomId).emit("receive_move", {
      index,
      player,
      scores: rooms[roomId].scores,
      winner: result?.winner || null,
      pattern: result?.pattern || [1,2,3],
      draw: rooms[roomId].board.every(cell => cell !== null)
    });
  });



 socket.on("restart_game", ({ roomId, nextStarter }) => {

  if (rooms[roomId]) {
    rooms[roomId].board = Array(9).fill(null); //reset the borad
  }

  io.to(roomId).emit("restart_game", { nextStarter });
});

  socket.on("disconnect", () => {

    console.log("Disconnected:", socket.id);

    for (let roomId in rooms) {

      if (rooms[roomId].players.includes(socket.id)) {

        rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);

       
        io.to(roomId).emit("opponent_left");


        if (rooms[roomId].players.length === 1) {
          
          rooms[roomId].scores = { X: 0, O: 0, Tie: 0 };//Reset Game
         
        } 
        else if (rooms[roomId].players.length === 0) {
         
            delete rooms[roomId]; //Delete the room
        }
      }
    }
  });
socket.on("leave_room", (roomId) => {
    if (rooms[roomId]) {
        rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);
        
        // Notify the other person the opponent left the game
        socket.to(roomId).emit("opponent_left");

        if (rooms[roomId].players.length === 0) {
            delete rooms[roomId];
        }
        
        socket.leave(roomId); // Physically remove the socket from the Socket.io room
        console.log(`User left room ${roomId}`);
    }
});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});