

const getRandomMove = (board) => {
  const emptyCells = board
    .map((val, idx) => (val === null ? idx : null))
    .filter(val => val !== null);

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};
export {getRandomMove};