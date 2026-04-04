import { useState, useCallback } from 'react';

export const useEmoji = () => {
  const [activeEmojis, setActiveEmojis] = useState([]);

  const spawnEmoji = useCallback((emoji) => {
    const id = Date.now();
    const x = Math.floor(Math.random() * 80) + 10; 
    
    setActiveEmojis((prev) => [...prev, { id, emoji, x }]);

    // Remove emoji after animation ends (2 seconds)
    setTimeout(() => {
      setActiveEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  return { activeEmojis, spawnEmoji };
};