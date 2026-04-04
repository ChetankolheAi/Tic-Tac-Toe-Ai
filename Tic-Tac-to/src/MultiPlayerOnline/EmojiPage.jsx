import React, { useState, useEffect, useRef } from 'react';

function EmojiPage({ roomId, spawnEmojiL, socket }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const EMOJI_LIST = [
        "😊", "😄", "😁", "🥳", "🤩", 
        "😢", "😭", "😟", "😔", "💔",
        "😠", "😡", "🤬", "😤", "😒",
        "😲", "😮", "😳", "🤯", "😱",
        "😏", "😎", "🙄", "😜", "🤡"
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSendEmoji = (emoji) => {
        if (!roomId) return;
        spawnEmojiL(emoji);
        socket.emit("send_emoji", { roomId: roomId, emoji: emoji });
        setIsOpen(false);
    };

    return (
        <div className=" -translate-x-1/2 z-[200]" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 shadow-lg ${
                    isOpen 
                    ? "bg-blue-600 border-blue-400 rotate-90" 
                    : "bg-zinc-900/80 backdrop-blur-md border-white/10 hover:border-blue-500"
                }`}
            >
                <span className="text-2xl">{isOpen ? "❌" : "😊"}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-64 animate-in fade-in zoom-in slide-in-from-top-4 duration-200">
                    <div className="grid grid-cols-5 gap-3">
                        {EMOJI_LIST.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleSendEmoji(emoji)}
                                className="text-2xl hover:scale-150 active:scale-90 transition-transform duration-200 p-1 flex items-center justify-center"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-zinc-900/95"></div>
                </div>
            )}
        </div>
    );
}

export default EmojiPage;