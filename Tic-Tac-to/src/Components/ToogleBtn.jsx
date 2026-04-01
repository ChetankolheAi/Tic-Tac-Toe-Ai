import React from 'react'

function ToogleBtn({isVsComputer,setIsVsComputer}) {
  return (
    <div>
        <button
            onClick={() => setIsVsComputer(!isVsComputer)}
            className="px-4 py-2 bg-gray-900 text-blue-500 rounded-xl 
            shadow-lg shadow-blue-500/20 hover:bg-gray-800 transition flex items-center gap-2 font-bold"
            >
            {isVsComputer ? (
                <>
                <i className="fa-solid fa-robot text-slate-400"></i>
                Computer
                </>
            ) : (
                <>
                <i className="fa-solid fa-users text-slate-400"></i>
                Multiplayer
                </>
            )}
        </button>
    </div>
  )
}

export default ToogleBtn