import { GRID_SIZE, animalEmojis, TILE_SIZE } from "../../constants/config";

export const generateBoard = () => {
  const board: string[] = [];

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    let isValid = false;
    let emoji = "";

    while (!isValid) {
      emoji = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
      isValid = true;

      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;

      // Horizontal check
      if (col >= 2 && board[i - 1] === emoji && board[i - 2] === emoji) {
        isValid = false;
      }

      // Vertical check
      if (
        row >= 2 &&
        board[i - GRID_SIZE] === emoji &&
        board[i - 2 * GRID_SIZE] === emoji
      ) {
        isValid = false;
      }
    }

    board.push(emoji);
  }
  return board;
};
