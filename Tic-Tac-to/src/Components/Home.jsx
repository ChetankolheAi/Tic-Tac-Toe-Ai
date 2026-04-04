import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBestMove } from '../utils/ComputerMove';
import { CheckWinner } from '../utils/CheckWinner';
import GameBoard from './PlayingGrid';
import ScoreCard from './ScoreCard';
import Result from './Result';
import ToogleBtn from './ToogleBtn';
import Footer from '../Pages/footer'


function MainGamePage({isVsComputer}) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXturn, setisXturn] = useState(true);
    const [Player1Score, setPlayer1Score] = useState(0);
    const [Player2Score, setPlayer2Score] = useState(0);
    const [TieScore, setTieScore] = useState(0);
    const [isDraw, setisDraw] = useState(false);
    const [winningCells, setWinningset] = useState([]);
    const [isVsComputerState, setIsVsComputer] = useState(isVsComputer); 
    const clickSound = useRef(null);
    const winSound = useRef(null);
    const DrawSound = useRef(null);
    const LooseSound = useRef(null);
    useEffect(() => {
        setIsVsComputer(isVsComputer);
    }, [isVsComputer]);

    useEffect(() => {
        clickSound.current = new Audio('/sound.mp3');
        winSound.current = new Audio('/Victory.mp3');
        DrawSound.current = new Audio('/Draw.mp3');
        LooseSound.current = new Audio('/Loose.mp3');
    }, []);



    const handleClick = (index) => {

        if (board[index] || CheckWinner(board) || isDraw) return;

        if (clickSound.current) {
            clickSound.current.currentTime = 0;
            clickSound.current.play().catch(() => {});
        }

        const newBoard = [...board];
        const currentPlayer = isXturn ? 'X' : 'O';
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        const result = CheckWinner(newBoard);

            if (result) {
                setWinningset(result.pattern);

                if (result.winner === 'X') setPlayer1Score(p => p + 1);
                if (result.winner === 'O') setPlayer2Score(p => p + 1);
                if(isVsComputer && result.winner==='O'){
                    if (LooseSound.current) {
                        LooseSound.current.currentTime = 0;
                        LooseSound.current.play().catch(() => {});
                    }
                } 
                else if (winSound.current) {
                    winSound.current.currentTime = 0;
                    winSound.current.play().catch(() => {});
                }
            } 
            else if (newBoard.every(cell => cell !== null)) {
                if (DrawSound.current) {
                    DrawSound.current.currentTime = 0;
                    DrawSound.current.play().catch(() => {});
                }
                setisDraw(true);
                setTieScore(p => p + 1);
            }

            setisXturn(!isXturn);
    };

    const result = CheckWinner(board);
    const winner = result?.winner;

    const handleRefresh = () => {
        setBoard(Array(9).fill(null));
        setisXturn(true);
        setisDraw(false);
        setWinningset([]);
    };

    const scores = [
        { label: "Player1 (X)", value: Player1Score },
        { label: "Tie", value: TieScore },
        !isVsComputer?
        { label: "Player2 (O)", value: Player2Score }:
        { label: "Computer (O)", value: Player2Score },
    
    ];
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBoard(Array(9).fill(null));
        setisXturn(true);
        setisDraw(false);
        setWinningset([]);
        setTieScore(0);
        setPlayer1Score(0);
        setPlayer2Score(0);
    }, [isVsComputerState]);



    useEffect(() => {
        if (!isXturn && isVsComputerState && !CheckWinner(board)) {
            const timeout = setTimeout(() => {
                const move = getBestMove(board);
                handleClick(move);
            }, 500); 

            return () => clearTimeout(timeout);
        }
    }, [board, isXturn,isVsComputerState]);

  return (
    <div className="bg-black h-screen w-full flex flex-col items-center justify-center gap-5 p-10">
         
        <ToogleBtn
        isVsComputer={isVsComputerState}
        setIsVsComputer={setIsVsComputer}
          />
        <ScoreCard
          scores={scores}
        />

        <GameBoard 
            board={board} 
            handleClick={handleClick} 
            winningCells={winningCells} 
            isXturn ={isXturn}
        />
        <Result
          winner={winner}
          isDraw={isDraw}
          isXturn={isXturn}
          handleRefresh={handleRefresh}
        />
        <Link 
            to="/" 
            className=" text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}

export default MainGamePage;