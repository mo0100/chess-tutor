import { Chess } from 'chess.js'

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 }
const PST = {
  p: [[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,27,10,5,5],[0,0,0,20,25,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-25,10,10,5],[0,0,0,0,0,0,0,0]],
  n: [[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
  b: [[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
  r: [[0,0,0,5,5,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],
  q: [[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]],
  k: [[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]]
};

function evaluateBoard(game) {
  let totalEval = 0; const board = game.board();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const val = PIECE_VALUES[piece.type] + PST[piece.type][piece.color === 'w' ? i : 7-i][j];
        totalEval += (piece.color === 'w' ? val : -val);
      }
    }
  }
  return totalEval;
}

function minimax(game, depth, alpha, beta, isMax) {
  if (depth === 0 || game.isGameOver()) return evaluateBoard(game);
  const moves = game.moves();
  if (isMax) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move); const ev = minimax(game, depth - 1, alpha, beta, false); game.undo();
      maxEval = Math.max(maxEval, ev); alpha = Math.max(alpha, ev); if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move); const ev = minimax(game, depth - 1, alpha, beta, true); game.undo();
      minEval = Math.min(minEval, ev); beta = Math.min(beta, ev); if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getBestMove(game, level) {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;
  if (level === 'easy') return moves[Math.floor(Math.random() * moves.length)];
  let bestMove = null; let bestValue = Infinity;
  const depth = level === 'hard' ? 3 : 1;
  for (const move of moves) {
    game.move(move); const val = minimax(game, depth - 1, -Infinity, Infinity, true); game.undo();
    if (val < bestValue) { bestValue = val; bestMove = move; }
  }
  return bestMove;
}