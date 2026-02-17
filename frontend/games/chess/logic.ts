import { Chess, type Square, type Move } from "chess.js"

export interface ChessGameState {
  chess: Chess
  selectedSquare: Square | null
  moveHistory: string[]
}

// Piece Unicode characters mapping
export const PIECE_SYMBOLS: Record<string, string> = {
  wp: "♙",
  wn: "♘",
  wb: "♗",
  wr: "♖",
  wq: "♕",
  wk: "♔",
  bp: "♟",
  bn: "♞",
  bb: "♝",
  br: "♜",
  bq: "♛",
  bk: "♚",
}

export function createNewGame(): Chess {
  return new Chess()
}

export function getBoardArray(chess: Chess): (string | null)[][] {
  const board: (string | null)[][] = []
  const fen = chess.board()

  for (let i = 0; i < 8; i++) {
    const row: (string | null)[] = []
    for (let j = 0; j < 8; j++) {
      const piece = fen[i][j]
      if (piece) {
        const symbol = PIECE_SYMBOLS[`${piece.color}${piece.type}`]
        row.push(symbol || null)
      } else {
        row.push(null)
      }
    }
    board.push(row)
  }

  return board
}

export function getSquareFromCoords(row: number, col: number): Square {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]
  return `${files[col]}${ranks[row]}` as Square
}

export function getLegalMoves(chess: Chess, square: Square): Square[] {
  const moves = chess.moves({ square, verbose: true }) as Move[]
  return moves.map((move) => move.to)
}

export function makeMove(chess: Chess, from: Square, to: Square): boolean {
  try {
    chess.move({ from, to, promotion: "q" })
    return true
  } catch {
    return false
  }
}

export function isGameOver(chess: Chess): boolean {
  return chess.isGameOver()
}

export function getGameResult(chess: Chess): {
  isCheckmate: boolean
  isStalemate: boolean
  isDraw: boolean
  winner: "white" | "black" | null
} {
  const isCheckmate = chess.isCheckmate()
  const isStalemate = chess.isStalemate()
  const isDraw = chess.isDraw()

  let winner: "white" | "black" | null = null
  if (isCheckmate) {
    winner = chess.turn() === "w" ? "black" : "white"
  }

  return { isCheckmate, isStalemate, isDraw, winner }
}

export function calculateScore(chess: Chess): number {
  const result = getGameResult(chess)
  const moveCount = chess.history().length

  if (result.isCheckmate) {
    return 1000 - moveCount
  } else if (result.isStalemate || result.isDraw) {
    return 500
  }

  return Math.max(0, 100 - moveCount)
}

export function isInCheck(chess: Chess): boolean {
  return chess.inCheck()
}

export function getCurrentPlayer(chess: Chess): "white" | "black" {
  return chess.turn() === "w" ? "white" : "black"
}
