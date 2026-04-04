import { useState, useCallback } from 'react';

export const useEmoji = () => {
  const [activeEmojis, setActiveEmojis] = useState([]);

  const spawnEmoji = useCallback((emoji) => {
    const id = Date.now();
    // Random horizontal position between 10% and 90%
    const x = Math.floor(Math.random() * 80) + 10; 
    
    setActiveEmojis((prev) => [...prev, { id, emoji, x }]);

    // Remove emoji after animation ends (2 seconds)
    setTimeout(() => {
      setActiveEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2000);
  }, []);

  return { activeEmojis, spawnEmoji };
};