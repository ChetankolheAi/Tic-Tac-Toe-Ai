import React from 'react';

const EmojiOverlay = ({ activeEmojis }) => {
  return (
    <>
      <style>
        {`
          @keyframes emoji-float {
            0% { transform: translateY(0) scale(0); opacity: 0; }
            20% { transform: translateY(-20px) scale(1.5); opacity: 1; }
            100% { transform: translateY(-500px) scale(1); opacity: 0; }
          }
          .animate-emoji {
            animation: emoji-float 2s ease-out forwards;
          }
        `}
      </style>
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {activeEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-20 animate-emoji text-6xl select-none"
            style={{ left: `${item.x}%` }}
          >
            {item.emoji}
          </div>
        ))}
      </div>
    </>
  );
};

export default EmojiOverlay;