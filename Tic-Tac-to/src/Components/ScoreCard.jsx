import React from 'react'

function ScoreCard({ scores }) {
  return (
    <div className="
        grid grid-cols-3 gap-3 sm:gap-4 
        bg-gray-900 p-3 sm:p-5 
        rounded-xl shadow-lg shadow-blue-500/50 
        text-center 
        w-full max-w-[400px] 
        mx-4
        ">
      {scores.map((item, index) => (
        <div key={index}>
          <h1 className="
            text-xs sm:text-sm md:text-l 
            text-slate-400 font-bold uppercase tracking-wide
            
          ">
            {item.label}
          </h1>

          <h1 className="
            text-xl sm:text-2xl md:text-3xl 
            text-blue-500 font-black mt-1
          ">
            {item.value}
          </h1>
        </div>
      ))}
    </div>
  )
}

export default ScoreCard