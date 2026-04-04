import React, { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import { CheckWinner } from '../utils/CheckWinner';
import GameBoard from '../Components/PlayingGrid';
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
     const [isXChance , setisXChance] = useState(true);
    
    const clickSound = useRef(null);
    const winSound = useRef(null);
    const DrawSound = useRef(null);
    const LooseSound = useRef(null);

    useEffect(() => {
        clickSound.current = new Audio('/sound.mp3');
        winSound.current = new Audio('/Victory.mp3');
        DrawSound.current = new Audio('/Draw.mp3');
        LooseSound.current = new Audio('/Loose.mp3');
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
;

       socket.on("receive_move", ({ index, player: movePlayer, scores, winner, pattern, draw }) => {

            setBoard(prev => {
                const newBoard = [...prev];
                newBoard[index] = movePlayer;
                return newBoard;
            });

            // 🔊 click sound
            if (clickSound.current) {
                clickSound.current.currentTime = 0;
                clickSound.current.play().catch(() => {});
            }

            setGameScores(scores);

          
            if (winner) {
                setWinningset([...pattern]);

                if (winner === player) {
                    if (winSound.current) {
                        winSound.current.currentTime = 0;
                        winSound.current.play().catch(() => {});
                    }
                } else {
                    if (LooseSound.current) {
                        LooseSound.current.currentTime = 0;
                        LooseSound.current.play().catch(() => {});
                    }
                }
            } 
            else if (draw) {
                setisDraw(true);

                if (DrawSound.current) {
                    DrawSound.current.currentTime = 0;
                    DrawSound.current.play().catch(() => {});
                }
            }

            setisXturn(movePlayer === "X" ? false : true);
        });
        
        socket.on("room_full", () => alert("Room is full!"));

      
        socket.on("restart_game", ({ nextStarter }) => {
            setBoard(Array(9).fill(null));
            setisXturn(nextStarter === "X");
            setisXChance(nextStarter === "X");
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
            value: player === "X" ? gameScores.X:gameScores.O
        },
        { label: "Tie", value: gameScores.Tie },
        {
            label: `Opponent (${player === "X" ? "O" : "X"})`,
            value: player === "X" ? gameScores.O:gameScores.X
        }
    ];

    
           
    const handleRefresh = () => {
        const nextStarter = isXChance ? "O" : "X";
        socket.emit("restart_game",{ roomId,nextStarter});
    };

    if (!gameStarted) {
        if (player !== "") {
            return (
               <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-zinc-950 p-4 font-sans selection:bg-blue-500/30">
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-16 w-16 animate-ping rounded-full bg-blue-500/20"></div>
                    <div className="h-14 w-14 animate-spin rounded-full border-4 border-zinc-800 border-t-blue-500 border-b-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                </div>

                <div className="space-y-2 text-center">
                    <h2 className="animate-pulse text-2xl font-black tracking-tight text-white md:text-4xl">
                    WAITING FOR OPPONENT
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
                    Searching for a match...
                    </p>
                </div>

                <div className="flex w-full max-w-xs flex-col gap-3">
                    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 backdrop-blur-sm">
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Role</span>
                    <span className="font-mono text-lg font-bold text-blue-400">Player {player}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 backdrop-blur-sm">
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Room ID</span>
                    <span className="font-mono text-lg font-bold text-emerald-400">{roomId}</span>
                    </div>
                </div>

                <button
                    onClick={() => setPlayer("")}
                    className="group mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-tighter text-zinc-500 transition-colors hover:text-red-400"
                >
                    <span className="h-[1px] w-4 bg-zinc-700 transition-all group-hover:w-8 group-hover:bg-red-400"></span>
                    Leave Lobby
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
                isXturn={isXturn}
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



