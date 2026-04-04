import React from 'react';
import { Globe, Users, Cpu, Trophy } from 'lucide-react'; // Optional: install lucide-react for icons

import { useNavigate } from 'react-router-dom';
function HomeScreen() {

// Inside your HomeScreen function:
const navigate = useNavigate();
  const gameModes = [
    {
      id: 'online',
      title: 'Online Multiplayer',
      description: 'Battle against players worldwide',
      icon: <Globe className="w-8 h-8 text-blue-400" />,
      color: 'hover:border-blue-500'
    },
    {
      id: 'friends',
      title: 'Play with Friends',
      description: 'Local 2-player mode',
      icon: <Users className="w-8 h-8 text-green-400" />,
      color: 'hover:border-green-500'
    },
    {
      id: 'computer',
      title: 'Vs Computer',
      description: 'Challenge the AI',
      icon: <Cpu className="w-8 h-8 text-purple-400" />,
      color: 'hover:border-purple-500'
    },
    {
      id: 'tournament',
      title: 'Tournament',
      description: 'Compete for the top spot',
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      color: 'hover:border-yellow-500'
    },
  ];

  const handleNavigate = (id) => {
    if (id === "friends") navigate('/Friends');
    else if (id === "online") navigate('/OnlineMultiPlayer');
    else if (id === "computer") navigate('/Friends?mode=computer');
    else if( id=="tournament")navigate('/UnderDevelopment');
  };
  return (
    <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center gap-10 p-10 font-sans pt-20">

      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter mb-2">
          TIC <span className="text-blue-500">-TAC-</span> TOE
        </h1>
        <p className="text-gray-400">Choose your battleground</p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {gameModes.map((mode) => (
          <button
            key={mode.id}
            className={`flex items-center p-6 bg-zinc-900 border-2 border-zinc-800 rounded-2xl transition-all duration-300 hover:scale-105 ${mode.color} group`}
            onClick={() => handleNavigate(mode.id)}
          >
            <div className="p-3 sm:p-4 bg-black rounded-xl mr-5 group-hover:bg-zinc-800 transition-colors">
              {mode.icon}
            </div>
            <div className="text-left">
              <h3 className="text-base sm:text-xl font-bold text-white">{mode.title}</h3>
              <p className="text-xs text-gray-500">{mode.description}</p>
            </div>
          </button>
        ))}
      </div>


      <p className="text-zinc-600 text-sm mt-5 uppercase tracking-widest">
        Developed By Chetan Kolhe
      </p>
    </div>
  );
}

export default HomeScreen;