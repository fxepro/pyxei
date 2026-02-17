export type Player = "red" | "yellow" | null
export type Board = Player[][]
export type GameMode = "pvp" | "ai-easy" | "ai-medium"

export interface GameState {
  board: Board
  currentPlayer: Player
  winner: Player
  gameOver: boolean
  winningCells: number[][]
}

const ROWS = 6
const COLS = 7

export function createEmptyBoard(): Board {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null))
}

export function dropDisc(board: Board, col: number, player: Player): Board | null {
  // Find the lowest empty row in the column
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = player
      return newBoard
    }
  }
  return null // Column is full
}

export function checkWinner(board: Board): { winner: Player; cells: number[][] } {
  // Check horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const player = board[row][col]
      if (
        player &&
        player === board[row][col + 1] &&
        player === board[row][col + 2] &&
        player === board[row][col + 3]
      ) {
        return {
          winner: player,
          cells: [
            [row, col],
            [row, col + 1],
            [row, col + 2],
            [row, col + 3],
          ],
        }
      }
    }
  }

  // Check vertical
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS; col++) {
      const player = board[row][col]
      if (
        player &&
        player === board[row + 1][col] &&
        player === board[row + 2][col] &&
        player === board[row + 3][col]
      ) {
        return {
          winner: player,
          cells: [
            [row, col],
            [row + 1, col],
            [row + 2, col],
            [row + 3, col],
          ],
        }
      }
    }
  }

  // Check diagonal (down-right)
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const player = board[row][col]
      if (
        player &&
        player === board[row + 1][col + 1] &&
        player === board[row + 2][col + 2] &&
        player === board[row + 3][col + 3]
      ) {
        return {
          winner: player,
          cells: [
            [row, col],
            [row + 1, col + 1],
            [row + 2, col + 2],
            [row + 3, col + 3],
          ],
        }
      }
    }
  }

  // Check diagonal (down-left)
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 3; col < COLS; col++) {
      const player = board[row][col]
      if (
        player &&
        player === board[row + 1][col - 1] &&
        player === board[row + 2][col - 2] &&
        player === board[row + 3][col - 3]
      ) {
        return {
          winner: player,
          cells: [
            [row, col],
            [row + 1, col - 1],
            [row + 2, col - 2],
            [row + 3, col - 3],
          ],
        }
      }
    }
  }

  return { winner: null, cells: [] }
}

export function isBoardFull(board: Board): boolean {
  return board[0].every((cell) => cell !== null)
}

export function isColumnFull(board: Board, col: number): boolean {
  return board[0][col] !== null
}

export function getValidColumns(board: Board): number[] {
  return Array.from({ length: COLS }, (_, i) => i).filter((col) => !isColumnFull(board, col))
}

// AI Logic
export function getAIMove(board: Board, difficulty: "easy" | "medium"): number {
  const validCols = getValidColumns(board)

  if (difficulty === "easy") {
    // Random move
    return validCols[Math.floor(Math.random() * validCols.length)]
  }

  // Medium difficulty: Try to win, block opponent, or play strategically

  // 1. Check if AI can win
  for (const col of validCols) {
    const testBoard = dropDisc(board, col, "yellow")
    if (testBoard && checkWinner(testBoard).winner === "yellow") {
      return col
    }
  }

  // 2. Check if need to block opponent
  for (const col of validCols) {
    const testBoard = dropDisc(board, col, "red")
    if (testBoard && checkWinner(testBoard).winner === "red") {
      return col
    }
  }

  // 3. Prefer center columns
  const centerCols = validCols.filter((col) => col >= 2 && col <= 4)
  if (centerCols.length > 0) {
    return centerCols[Math.floor(Math.random() * centerCols.length)]
  }

  // 4. Random valid move
  return validCols[Math.floor(Math.random() * validCols.length)]
}
