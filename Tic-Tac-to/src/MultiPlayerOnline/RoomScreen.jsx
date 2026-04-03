import React from 'react';
import { ArrowLeft, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';

function RoomScreen({ setRoomId, joinRoom }) {
  return (
    <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center p-6 font-sans">
    
      <Link 
        to="/" 
        className="absolute top-20 left-10 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      <div className="bg-zinc-900 border-2 border-zinc-800 p-5 sm:p-10 rounded-3xl w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-blue-500/10 rounded-full mb-4">
            <Hash className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white">Join Room</h2>
          <p className="text-gray-500 mt-2 text-center">
            Enter a Room ID to play with a friend or join an existing lobby.
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 12345"
              className="w-full bg-black border-2 border-zinc-700 rounded-xl px-5 py-4 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-zinc-600"
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>

          <button
            onClick={joinRoom}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            Join Game
          </button>
        </div>
      </div>

      <p className="text-zinc-600 text-xs mt-10 tracking-widest uppercase">
        Secure Multiplayer Connection
      </p>
    </div>
  );
}

export default RoomScreen;