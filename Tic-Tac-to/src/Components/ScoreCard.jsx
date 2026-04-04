import React from 'react'

function ScoreCard({ scores, activeEmojis, activeEmojisL }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-gray-900 p-3 sm:p-5 rounded-xl shadow-lg shadow-blue-500/50 text-center w-full max-w-[400px] mx-4 relative">
      {scores.map((item, index) => {
        const isOpponent = item.label.toLowerCase().includes("opponent");
        const isYou = item.label.toLowerCase().includes("you");

        return (
          <div key={index} className="relative flex flex-col items-center">
            
            {/*Opponent Mssg*/}
            {isOpponent && activeEmojis && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                <div className="relative animate-bounce bg-zinc-800 text-black px-3 py-1 rounded-xl rounded-bl-none shadow-2xl border-2 border-red-500">
                  <span className="text-xl sm:text-2xl">{activeEmojis}</span>
                  <div className="absolute -bottom-2 left-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white"></div>
                </div>
              </div>
            )}

            {/* My Mssg*/}
            {isYou && activeEmojisL && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                <div className="relative animate-bounce bg-zinc-800 text-white px-3 py-1 rounded-xl rounded-br-none shadow-2xl border-2 border-emerald-500">
                  <span className="text-xl sm:text-2xl">{activeEmojisL}</span>
                  {/* Tail flipped to the right for your side */}
                  <div className="absolute -bottom-2 right-0 w-0 h-0 border-r-[8px] border-r-transparent border-t-[8px] border-t-zinc-800"></div>
                </div>
              </div>
            )}

            <h1 className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wide">
              {item.label}
            </h1>

            <h1 className="text-xl sm:text-2xl md:text-3xl text-blue-500 font-black mt-1">
              {item.value}
            </h1>
          </div>
        );
      })}
    </div>
  )
}

export default ScoreCard