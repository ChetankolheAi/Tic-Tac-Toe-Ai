import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Wrench } from "lucide-react";

function UnderDevelopment() {
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white text-center gap-6 p-10">

      <div className="text-blue-500">
        <Wrench size={60} />
      </div>

        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
            Feature <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Offline</span>
        </h1>

      <p className="text-gray-400 max-w-md">
        This feature is currently being built. Please check back later!
      </p>

      <Link
        to="/"
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl transition"
      >
        <ArrowLeft size={18} />
        Go Back Home
      </Link>

    </div>
  );
}

export default UnderDevelopment;