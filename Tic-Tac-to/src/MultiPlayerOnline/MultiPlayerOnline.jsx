import React, { useState, useRef } from "react";
import { socket } from "../socket";
import { CheckWinner } from '../utils/CheckWinner';
import GameBoard from '../Components/PlayingGrid';
import Result from '../Components/Result';
import ScoreCard from '../Components/ScoreCard';
import RoomScreen from "./RoomScreen";
import WaitingLobby from "./WaitingLobby";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEmoji } from '../hooks/useEmoji';
import { useMultiplayerSocket } from '../hooks/useMultiplayerSocket';

function MultiPlayerOnline() {
    const [roomId, setRoomId] = useState("");
    const [player, setPlayer] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [gameScores, setGameScores] = useState({ X: 0, O: 0, Tie: 0 });
    const [isDraw, setisDraw] = useState(false);
    const [winningCells, setWinningset] = useState([]);
    const [isXturn, setisXturn] = useState(true);
    const [isXChance, setisXChance] = useState(true);
    console.log(isXChance)
    const sounds = {
        click: useRef(new Audio('/sound.mp3')),
        win: useRef(new Audio('/Victory.mp3')),
        draw: useRef(new Audio('/Draw.mp3')),
        loose: useRef(new Audio('/Loose.mp3'))
    };

    const { activeEmojis: activeEmojisLocal, spawnEmoji: spawnEmojiL } = useEmoji();
    const { activeEmojis: activeEmojisServer, spawnEmoji: spawnEmojiS } = useEmoji();

    useMultiplayerSocket({
        socket, roomId, player, setPlayer, setGameStarted, setBoard,
        setGameScores, setisDraw, setWinningset, setisXturn, setisXChance,
        spawnEmojiS, sounds
    });

    const joinRoom = () => {
        if (roomId !== "" && !gameStarted && player === "") {
            socket.emit("join_room", roomId);
        }
    };

    const LeaveRoom = () => {
        socket.emit("leave_room", { roomId, player });
    };

    const handleClick = (index) => {
        if (board[index] != null || winningCells.length > 0 || isDraw) return;
        if (player !== (isXturn ? "X" : "O")) return;
        socket.emit("make_move", { roomId, index, player });
    };

    const handleRefresh = () => {
        socket.emit("restart_game", { roomId });
    };

    const result = CheckWinner(board);
    const winner = result?.winner;

    const scores = [
        { label: `You (${player})`, value: player === "X" ? gameScores.X : gameScores.O },
        { label: "Tie", value: gameScores.Tie },
        { label: `Opponent (${player === "X" ? "O" : "X"})`, value: player === "X" ? gameScores.O : gameScores.X }
    ];

    if (!gameStarted) {
        return player !== "" 
            ? <WaitingLobby player={player} roomId={roomId} setPlayer={setPlayer} />
            : <RoomScreen setRoomId={setRoomId} joinRoom={joinRoom} />;
    }

    return (
        <div className="bg-black h-screen w-full flex flex-col items-center justify-center gap-2 p-10 relative overflow-hidden">
            <h2 className="text-zinc-400 font-bold uppercase tracking-widest text-sm">
                You are playing as <span className="text-blue-500 text-lg">{player}</span>
            </h2>
            <ScoreCard 
                scores={scores} 
                activeEmojis={activeEmojisServer?.slice(-1)[0]?.emoji || null} 
                activeEmojisL={activeEmojisLocal?.slice(-1)[0]?.emoji || null} 
            /> 
            <Result 
                winner={winner} isDraw={isDraw} isXturn={isXturn} 
                handleRefresh={handleRefresh} roomId={roomId}
                spawnEmojiL={spawnEmojiL} socket={socket}
            />
            <GameBoard 
                board={board} handleClick={handleClick} 
                winningCells={winningCells} isXturn={isXturn} 
            />
            <Link to="/" onClick={LeaveRoom} className="text-gray-400 hover:text-white flex items-center gap-2 mt-4">
                <ArrowLeft size={20} />
                <span>Leave Room</span>
            </Link>
        </div>
    );
}

export default MultiPlayerOnline;