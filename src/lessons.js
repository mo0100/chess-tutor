export const LESSONS = [
  {
    title: 'Piece movement',
    content: 'Pawns move forward 1 (two from start), capture diagonally. Rooks move straight, bishops diagonally, knights L-shape, queen combines rook+bishop, king moves one square. Practice moving each piece.'
  },
  {
    title: 'Check & Checkmate',
    content: 'Check means the king is attacked. You must remove check by moving the king, blocking, or capturing the attacking piece. Checkmate: no legal moves to escape check.'
  },
  {
    title: 'Basic mate patterns',
    content: 'Learn mate-in-1 patterns and the concept of back-rank, smothered mate, and the simple two-rook mate.'
  }
]

export const PUZZLES = [
  { title: 'Mate in 1 — easy', hint: 'Look for a direct check on the king', fen: '6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1' },
  { title: 'Fork tactic', hint: 'A knight move forks king and queen', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4' },
  { title: 'Back-rank mate', hint: 'Open a line to the enemy king', fen: '6k1/5ppp/8/8/8/8/5PPP/6RK w - - 0 1' }
]
