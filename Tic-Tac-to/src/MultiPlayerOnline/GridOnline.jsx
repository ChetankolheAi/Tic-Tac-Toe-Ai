import React from 'react';

function GameBoard({ board, handleClick }) {
  return (
    <div className="grid grid-cols-3 border-4 border-blue-900">
      {board.map((val, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          className={`flex items-center justify-center cursor-pointer 
          
          h-[90px] w-[90px] 
          sm:h-[95px] sm:w-[95px] 
          md:h-[100px] md:w-[100px]

          bg-black border border-blue-900
          hover:bg-gray-800 hover:scale-105 active:scale-95 transition duration-200

        `}
        >
          <span
            className={`font-bold 
            text-4xl sm:text-6xl md:text-8xl
            ${val === "X" ? "text-blue-700" : "text-blue-400"}`}
          >
            {val}
          </span>
        </div>
      ))}
    </div>
  );
}

export default GameBoard;