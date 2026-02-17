export type TetrisCell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type TetrisBoard = TetrisCell[][]
export type TetrisPiece = {
  shape: number[][]
  color: TetrisCell
  x: number
  y: number
}

const PIECES = [
  { shape: [[1, 1, 1, 1]], color: 1 }, // I
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 2,
  }, // O
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: 3,
  }, // T
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 4,
  }, // S
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: 5,
  }, // Z
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 6,
  }, // L
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: 7,
  }, // J
]

export function createEmptyBoard(rows = 20, cols = 10): TetrisBoard {
  return Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0))
}

export function getRandomPiece(): TetrisPiece {
  const piece = PIECES[Math.floor(Math.random() * PIECES.length)]
  return {
    shape: piece.shape,
    color: piece.color as TetrisCell,
    x: Math.floor(10 / 2) - Math.floor(piece.shape[0].length / 2),
    y: 0,
  }
}

export function canMove(board: TetrisBoard, piece: TetrisPiece, dx: number, dy: number): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.x + x + dx
        const newY = piece.y + y + dy

        if (newX < 0 || newX >= board[0].length || newY >= board.length) {
          return false
        }

        if (newY >= 0 && board[newY][newX]) {
          return false
        }
      }
    }
  }
  return true
}

export function rotatePiece(piece: TetrisPiece): TetrisPiece {
  const rotated = piece.shape[0].map((_, i) => piece.shape.map((row) => row[i]).reverse())
  return { ...piece, shape: rotated }
}

export function mergePiece(board: TetrisBoard, piece: TetrisPiece): TetrisBoard {
  const newBoard = board.map((row) => [...row])

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] && piece.y + y >= 0) {
        newBoard[piece.y + y][piece.x + x] = piece.color
      }
    }
  }

  return newBoard
}

export function clearLines(board: TetrisBoard): { board: TetrisBoard; linesCleared: number } {
  let linesCleared = 0
  const newBoard = board.filter((row) => {
    if (row.every((cell) => cell !== 0)) {
      linesCleared++
      return false
    }
    return true
  })

  while (newBoard.length < board.length) {
    newBoard.unshift(Array(board[0].length).fill(0))
  }

  return { board: newBoard, linesCleared }
}

export function calculateScore(linesCleared: number, level: number): number {
  const baseScores = [0, 100, 300, 500, 800]
  return baseScores[linesCleared] * (level + 1)
}
