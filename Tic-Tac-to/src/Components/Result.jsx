import React from 'react'
import EmojiPage from '../MultiPlayerOnline/EmojiPage'
function Result({winner,isDraw,isXturn,handleRefresh,roomId,spawnEmojiL,socket}) {
  return (
  <div className="flex justify-between items-center w-[290px] sm:w-[350px] w-[250px] pl-5 bg-gray-900 p-3 rounded-xl shadow-lg shadow-blue-500/50">
        <h1 className="text-lg text-slate-400 font-bold">
          {winner ? (
            <span className="text-red-500">Winner: {winner}</span>
          ) : isDraw ? (
            <span className="text-yellow-500">It's a Draw 😐</span>
          ) : (
            <>Turn: <span className="text-blue-500">{isXturn ? "X" : "O"}</span></>
          )}
        </h1>
       
        <button
          onClick={handleRefresh?handleRefresh:""}
          className="px-4 py-2 bg-black text-blue-500 rounded-xl hover:bg-gray-800 font-bold"
        >
          Restart
        </button>
        {roomId? <EmojiPage 
              roomId={roomId}
              spawnEmojiL={spawnEmojiL}
              socket={socket}
          />:""}
         
      </div>
  )
}

export default Result