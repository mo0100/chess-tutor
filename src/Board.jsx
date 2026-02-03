import React from 'react'
import { Chess } from 'chess.js'

const pieceUnicode = {
  pw: '♙', pb: '♟', rw: '♖', rb: '♜', nw: '♘', nb: '♞',
  bw: '♗', bb: '♝', qw: '♕', qb: '♛', kw: '♔', kb: '♚'
};

export default function Board({ 
  fen, onSquareClick, selectedSquare, legalMoves, capturables = [], blockedPath = [], blockers = [], hint 
}) {
  const chess = new Chess(fen);
  const files = ['a','b','c','d','e','f','g','h'];
  const ranks = ['8','7','6','5','4','3','2','1'];
  const squares = [];

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const square = files[f] + ranks[r];
      const piece = chess.get(square);
      
      const isSelected = selectedSquare === square;
      const isBlocked = (blockedPath || []).includes(square);
      const isBlocker = (blockers || []).includes(square);
      const isLegal = (legalMoves || []).includes(square);
      const isCapturable = (capturables || []).includes(square);
      const isHint = hint === square;

      squares.push(
        <div
          key={square}
          className={`square ${(r + f) % 2 === 0 ? 'light' : 'dark'} 
            ${isSelected ? 'selected' : ''} 
            ${isBlocked ? 'path-blocked-red' : ''}
            ${isBlocker ? 'flash-green' : ''}
            ${isHint ? 'hint-square' : ''}`}
          onClick={() => onSquareClick(square)}
        >
          {piece && <span className="piece">{pieceUnicode[piece.type + piece.color]}</span>}
          {isLegal && !isCapturable && <span className="dot"></span>}
          {isCapturable && <div className="capture-ring"></div>}
        </div>
      );
    }
  }
  return <div className="board">{squares}</div>;
}