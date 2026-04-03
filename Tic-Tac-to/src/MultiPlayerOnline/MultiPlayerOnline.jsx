import React, { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import { CheckWinner } from '../utils/CheckWinner';
import GameBoard from './GridOnline';
import Result from '../Components/Result';
import ScoreCard from '../Components/ScoreCard';
import RoomScreen from "./RoomScreen";
import { ArrowLeft, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';

function MultiPlayerOnline() {
    const [roomId, setRoomId] = useState("");
    const [player, setPlayer] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [gameScores, setGameScores] = useState({ X: 0, O: 0, Tie: 0 });
    const [isDraw, setisDraw] = useState(false);
    const [winningCells, setWinningset] = useState([]);
    const [isXturn, setisXturn] = useState(true);
    
    const clickSound = useRef(null);
    const winSound = useRef(null);

    useEffect(() => {
        clickSound.current = new Audio('/sound.mp3');
        winSound.current = new Audio('/Victory.mp3');
    }, []);

    const joinRoom = () => {
        if (roomId !== "" && !gameStarted && player === "") {
            socket.emit("join_room", roomId);
        }
    };
    const LeaveRoom =()=>{
      socket.emit("leave_room",roomId)
    }

    useEffect(() => {
        socket.on("player_role", (role) => setPlayer(role));

        socket.on("start_game", ({ scores }) => {
            setGameScores(scores);
            setGameStarted(true);
        });

        socket.on("score_updated", (newScores) => {
            setGameScores(newScores);
        });

        socket.on("receive_move", ({ index, player: movePlayer }) => {
            setBoard((prev) => {
                if (prev[index] !== null) return prev;
                const newBoard = [...prev];
                newBoard[index] = movePlayer;

                const result = CheckWinner(newBoard);
                if (result) {
                    setWinningset(result.pattern);
                    if (winSound.current) {
                        winSound.current.currentTime = 0;
                        winSound.current.play().catch(() => {});
                    }
                    if (player === movePlayer) {
                        socket.emit("update_score", { roomId, winner: result.winner });
                    }
                } else if (newBoard.every(cell => cell !== null)) {
                    setisDraw(true);
                    if (player === movePlayer) {
                        socket.emit("update_score", { roomId, winner: "Tie" });
                    }
                }
                return newBoard;
            });

            if (clickSound.current) {
                clickSound.current.currentTime = 0;
                clickSound.current.play().catch(() => {});
            }
            setisXturn(movePlayer === "X" ? false : true);
        });
        
        socket.on("room_full", () => alert("Room is full!"));

        socket.on("restart_game", () => {
            setBoard(Array(9).fill(null));
            setisXturn(true);
            setisDraw(false);
            setWinningset([]);
        });
        
        return () => {
          
            socket.off("player_role");
            socket.off("start_game");
            socket.off("score_updated");
            socket.off("receive_move");
            socket.off("room_full");
            socket.off("restart_game");
        };
    }, [player, roomId]);

    useEffect(() => {


      socket.on("opponent_left", () => {

          alert("Opponent left the game.");
          setGameStarted(false);
          setBoard(Array(9).fill(null));
          setWinningset([]);
          setisDraw(false);
      });
      return () => {
          socket.off("opponent_left");
      };
      
  }, [roomId,player]);


    const handleClick = (index) => {

        if (board[index] != null || winningCells.length > 0 || isDraw) return;
        if (player !== (isXturn ? "X" : "O")) return;

        socket.emit("make_move", { roomId, index, player });

    };

    const result = CheckWinner(board);
    const winner = result?.winner;

    const scores = [
        {
            label: `You (${player})`,
            value: player === "X" ? gameScores.X==0?0:gameScores.X-1 : gameScores.O==0?0:gameScores.O-1
        },
        { label: "Tie", value: gameScores.Tie==0?0:gameScores.Tie-1 },
        {
            label: `Opponent (${player === "X" ? "O" : "X"})`,
            value: player === "X" ? gameScores.O==0?0:gameScores.O-1 : gameScores.X==0?0:gameScores.X-1
        },
    ];

    const handleRefresh = () => {
        socket.emit("restart_game", roomId);
    };

    if (!gameStarted) {
        if (player !== "") {
            return (
                <div className="bg-black h-screen w-full flex flex-col items-center justify-center gap-5">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <h2 className="text-white text-2xl font-bold">Waiting for Opponent...</h2>
                    <p className="text-sm text-white italic bg-slate-900 px-5 py-3 rounded-xl">You are Player {player}</p>
                    <p className="text-gray-400 bg-slate-900 px-5 py-3 rounded-xl">Room ID: <span className="text-blue-400">{roomId}</span></p>
                    <button 
                        onClick={() => setPlayer("")} 
                        className="text-red-500 underline mt-4"
                    >
                      Go Back
                    </button>
                </div>
            );
        }
        return <RoomScreen setRoomId={setRoomId} joinRoom={joinRoom} />;
    }

    return (
        <div className="bg-black h-screen w-full flex flex-col items-center justify-center gap-5 p-10">
         
            <h2 className="text-zinc-400 font-bold uppercase tracking-widest text-sm">
                You are playing as <span className="text-blue-500 text-lg">{player}</span>
            </h2>
            <ScoreCard scores={scores} />
            <Result
                winner={winner}
                isDraw={isDraw}
                isXturn={isXturn}
                handleRefresh={handleRefresh}
            />
            <GameBoard
                board={board}
                handleClick={handleClick}
                winningCells={winningCells}
            />
            
              <Link 
              to="/" 
              onClick={LeaveRoom}
              className=" text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Leave Room</span>
            </Link>

            
        </div>
    );
}

export default MultiPlayerOnline;