// Pure game helpers — no React, easy to reason about.

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const cellKey = (teamKey, catId, diff) => `${teamKey}|${catId}|${diff}`;

// Assign a distinct unseen question to each board cell.
// Both teams get their own question per (category, difficulty).
export function buildBoard(activeCats, pool) {
  const board = {};
  for (const cat of activeCats) {
    for (const diff of [1, 2, 3]) {
      const matches = shuffle(pool.filter((q) => q.category_id === cat.id && q.difficulty === diff));
      board[cellKey("team1", cat.id, diff)] = matches[0] || null;
      board[cellKey("team2", cat.id, diff)] = matches[1] || null;
    }
  }
  return board;
}

export function countPlayableCells(board) {
  return Object.values(board).filter(Boolean).length;
}
