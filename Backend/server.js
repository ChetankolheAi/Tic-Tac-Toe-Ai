const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { registerGameHandlers } = require("./socket/gameHandlers");

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
  
  // Register the separated logic
  registerGameHandlers(io, socket, rooms);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});