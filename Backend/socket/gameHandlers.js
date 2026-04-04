const { CheckWinner } = require("../utils/CheckWinner");

const registerGameHandlers = (io, socket, rooms) => {
  
    const handleExit = (socketId) => {
        for (let roomId in rooms) {
        if (rooms[roomId].players[socketId]) {

            socket.to(roomId).emit("opponent_left");//Notify That oppo Left

            delete rooms[roomId].players[socketId];

            // If room is empty, delete it. Otherwise, reset the game state.
            if (Object.keys(rooms[roomId].players).length === 0) {
            delete rooms[roomId];
            
            } else {
            rooms[roomId].board = Array(9).fill(null);
            rooms[roomId].scores = { X: 0, O: 0, Tie: 0 };
            rooms[roomId].nextStarter = "X"; 
            }
        }
        }
    };

    socket.on("join_room", (roomId) => {

        if (!rooms[roomId]) {
        rooms[roomId] = {
            players: {}, 
            scores: { X: 0, O: 0, Tie: 0 },
            board: Array(9).fill(null),
            nextStarter: "X" 
        };
        }

        const roomData = rooms[roomId];
        const playerIds = Object.keys(roomData.players);

        // Prevent same user joining twice
        if (playerIds.includes(socket.id)) return;

        // Room full check
        if (playerIds.length >= 2) {
        socket.emit("room_full");
        return;
        }

        // Check which role is currently NOT taken in the room
        const takenRoles = Object.values(roomData.players);
        let role;
        if (!takenRoles.includes("X")) {
        role = "X";
        } else {
        role = "O";
        }

        socket.join(roomId);
        roomData.players[socket.id] = role; // Map ID to Role
        socket.emit("player_role", role);

        console.log(`User ${socket.id} joined room ${roomId} as ${role}`);

        //Start game on 2 players are present
        if (Object.keys(roomData.players).length === 2) {
        io.to(roomId).emit("start_game", { 
            scores: roomData.scores,
            starter: roomData.nextStarter 
        });
        }
    });

    socket.on("make_move", ({ roomId, index, player }) => {
        if (!rooms[roomId]) return;

        rooms[roomId].board[index] = player;
        const result = CheckWinner(rooms[roomId].board);
        const isDraw = !result && rooms[roomId].board.every(cell => cell !== null);

        if (result) {
            rooms[roomId].scores[result.winner] += 1;
        } else if (isDraw) {
            rooms[roomId].scores.Tie += 1;
        }

        io.to(roomId).emit("receive_move", {
            index,
            player,
            scores: rooms[roomId].scores,
            winner: result?.winner || null,
            pattern: result?.pattern || [],
            draw: isDraw
        });
    });

    socket.on("restart_game", ({ roomId }) => {
        if (rooms[roomId]) {
            rooms[roomId].board = Array(9).fill(null);
            //toggle for next starter
            rooms[roomId].nextStarter = rooms[roomId].nextStarter === "X" ? "O" : "X";

            io.to(roomId).emit("restart_game", { 
            nextStarter: rooms[roomId].nextStarter 
            });
        }
    });

    socket.on("leave_room", ({ roomId }) => {
        handleExit(socket.id);
        socket.leave(roomId);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
        handleExit(socket.id);
    });

    socket.on("send_emoji", ({ roomId, emoji }) => {
        if (roomId) {
            socket.to(roomId).emit("receive_emoji", { emoji });
        }
    });
};

module.exports = { registerGameHandlers };