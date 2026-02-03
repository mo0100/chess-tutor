import React, { useState, useEffect } from 'react'
import Board from './Board'
import { Chess } from 'chess.js'
import { getBestMove } from './ai'
import { LESSONS } from './lessons'
import './styles.css'

function App() {
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [legalMoves, setLegalMoves] = useState([])
  const [capturables, setCapturables] = useState([]) 
  const [status, setStatus] = useState('')
  const [blockedPath, setBlockedPath] = useState([]) 
  const [blockers, setBlockers] = useState([]) 
  const [hint, setHint] = useState(null)
  const [error, setError] = useState(null)
  const [aiLevel, setAiLevel] = useState('hard')

  useEffect(() => {
    if (game.isCheckmate()) setStatus('Checkmate!')
    else if (game.isDraw()) setStatus('Draw')
    else if (game.isCheck()) setStatus('Check!')
    else setStatus(`${game.turn() === 'w' ? 'White' : 'Black'} to move`)
  }, [game])

  const calculateBlockedPath = (from, type) => {
    const blocked = []; const blockerSquares = [];
    const pieceNames = { r: 'Rook', b: 'Bishop', q: 'Queen' };
    const f = from[0], r = parseInt(from[1]);
    const directions = [];
    if (type === 'r' || type === 'q') directions.push([0, 1], [0, -1], [1, 0], [-1, 0]);
    if (type === 'b' || type === 'q') directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);

    directions.forEach(([df, dr]) => {
      let hitObstacle = false;
      for (let i = 1; i < 8; i++) {
        const nf = String.fromCharCode(f.charCodeAt(0) + (df * i));
        const nr = r + (dr * i);
        if (nf < 'a' || nf > 'h' || nr < 1 || nr > 8) break;
        const sq = nf + nr;
        if (hitObstacle) blocked.push(sq);
        else {
          const pieceOnSq = game.get(sq);
          if (pieceOnSq) { hitObstacle = true; blockerSquares.push(sq); }
        }
      }
    });

    if (blockerSquares.length > 0) {
      setBlockedPath(blocked);
      setBlockers(blockerSquares);
      setError(`Path Blocked! Your ${pieceNames[type]} cannot jump over other pieces.`);
    } else {
      setError(`Illegal Move! That is not how a ${pieceNames[type]} moves.`);
    }
  };

  const showHint = () => {
    const best = getBestMove(game, 'hard');
    if (best) setHint(best.to);
  };

  const closeError = () => { setError(null); setBlockedPath([]); setBlockers([]); }

  function onSquareClick(square) {
    const piece = game.get(square)
    
    // Select Piece
    if (piece && piece.color === game.turn()) {
      closeError(); setHint(null);
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves.map(m => m.to));
      setCapturables(moves.filter(m => m.captured).map(m => m.to));
      return;
    }

    // Attempt Move
    if (selectedSquare && legalMoves.includes(square)) {
      const newGame = new Chess(game.fen())
      newGame.move({ from: selectedSquare, to: square, promotion: 'q' })
      setGame(newGame);
      setSelectedSquare(null); setLegalMoves([]); setCapturables([]); setHint(null);
      
      if (!newGame.isGameOver() && newGame.turn() === 'b') {
        setTimeout(() => {
          const move = getBestMove(newGame, aiLevel);
          if (move) {
            const aiGame = new Chess(newGame.fen());
            aiGame.move(move);
            setGame(aiGame);
          }
        }, 500);
      }
      return;
    }

    // Show Error Bubble for Illegal Move
    if (selectedSquare && !legalMoves.includes(square)) {
      const activePiece = game.get(selectedSquare);
      if (activePiece.type === 'n') {
        setError("Illegal Move! Knights move in an 'L' shape and are the only pieces that can jump.");
      } else if (activePiece.type === 'p') {
        setError("Illegal Move! Pawns move forward but capture diagonally.");
      } else {
        calculateBlockedPath(selectedSquare, activePiece.type);
      }
      return;
    }

    setSelectedSquare(null); setLegalMoves([]); closeError();
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">Chess<span>Tutor</span></div>
        <div className="nav-actions">
          <button className="btn-hint" onClick={showHint}>💡 Hint</button>
          <select value={aiLevel} onChange={(e) => setAiLevel(e.target.value)} className="ai-select">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button className="btn-primary" onClick={() => setGame(new Chess())}>New Game</button>
        </div>
      </nav>
      <main className="game-layout">
        <div className="board-section">
          <div className="game-status">{status}</div>
          <div className="board-wrapper">
            {error && (
              <div className="info-bubble" onClick={closeError}>
                <div className="info-content">
                  <p>{error}</p>
                  <span className="info-dismiss">GOT IT</span>
                </div>
              </div>
            )}
            <Board 
              fen={game.fen()} 
              onSquareClick={onSquareClick} 
              selectedSquare={selectedSquare} 
              legalMoves={legalMoves} 
              capturables={capturables} 
              blockedPath={blockedPath} 
              blockers={blockers} 
              hint={hint} 
            />
          </div>
        </div>
        <aside className="sidebar">
          <div className="card lesson-card">
            <h3>Chess Tutor Tips</h3>
            <p>{LESSONS[0].content}</p>
            <div className="divider"></div>
            <p style={{fontSize: '0.9rem', color: '#94a3b8'}}>
              Click a piece to see its moves. If you're stuck, use the 💡 Hint button!
            </p>
          </div>
        </aside>
      </main>
    </div>
  )
}
export default App