import React from 'react';

function WaitingLobby({ player, roomId, setPlayer }) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-zinc-950 p-4 font-sans">
            <div className="relative flex items-center justify-center">
                <div className="absolute h-16 w-16 animate-ping rounded-full bg-blue-500/20"></div>
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-zinc-800 border-t-blue-500 border-b-blue-500"></div>
            </div>
            <div className="space-y-2 text-center">
                <h2 className="animate-pulse text-2xl font-black text-white md:text-4xl">WAITING FOR OPPONENT</h2>
                <p className="text-zinc-500 text-sm tracking-widest uppercase">Searching for a match...</p>
            </div>
            <div className="flex w-full max-w-xs flex-col gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4">
                    <span className="text-zinc-400 text-xs font-bold uppercase">Role</span>
                    <span className="font-mono text-lg font-bold text-blue-400">Player {player}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-4">
                    <span className="text-zinc-400 text-xs font-bold uppercase">Room ID</span>
                    <span className="font-mono text-lg font-bold text-emerald-400">{roomId}</span>
                </div>
            </div>
            <button onClick={() => setPlayer("")} className="group mt-8 flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-red-400">
                <span className="h-[1px] w-4 bg-zinc-700 transition-all group-hover:w-8 group-hover:bg-red-400"></span>
                Leave Lobby
            </button>
        </div>
    );
}

export default WaitingLobby;