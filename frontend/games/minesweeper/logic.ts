export type CellState = "hidden" | "revealed" | "flagged"
export type Difficulty = "easy" | "medium" | "hard"

export interface Cell {
  isMine: boolean
  adjacentMines: number
  state: CellState
}

export interface MinesweeperState {
  board: Cell[][]
  rows: number
  cols: number
  mines: number
  flagsPlaced: number
  gameOver: boolean
  won: boolean
  firstClick: boolean
  revealedCount: number
}

const DIFFICULTIES = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 },
}

export const createEmptyBoard = (rows: number, cols: number): Cell[][] => {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({
          isMine: false,
          adjacentMines: 0,
          state: "hidden" as CellState,
        })),
    )
}

export const placeMines = (board: Cell[][], mineCount: number, firstRow: number, firstCol: number): Cell[][] => {
  const rows = board.length
  const cols = board[0].length
  let placed = 0

  while (placed < mineCount) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)

    if (!board[row][col].isMine && !(Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1)) {
      board[row][col].isMine = true
      placed++
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!board[i][j].isMine) {
        board[i][j].adjacentMines = countAdjacentMines(board, i, j)
      }
    }
  }

  return board
}

const countAdjacentMines = (board: Cell[][], row: number, col: number): number => {
  let count = 0
  const rows = board.length
  const cols = board[0].length

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i
      const newCol = col + j
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol].isMine) {
        count++
      }
    }
  }

  return count
}

export const createInitialState = (difficulty: Difficulty = "easy"): MinesweeperState => {
  const { rows, cols, mines } = DIFFICULTIES[difficulty]
  const board = createEmptyBoard(rows, cols)

  return {
    board,
    rows,
    cols,
    mines,
    flagsPlaced: 0,
    gameOver: false,
    won: false,
    firstClick: true,
    revealedCount: 0,
  }
}

export const revealCell = (state: MinesweeperState, row: number, col: number): MinesweeperState => {
  if (state.gameOver || state.board[row][col].state !== "hidden") {
    return state
  }

  let newBoard = state.board.map((r) => r.map((c) => ({ ...c })))
  let firstClick = state.firstClick

  if (firstClick) {
    newBoard = placeMines(newBoard, state.mines, row, col)
    firstClick = false
  }

  const cell = newBoard[row][col]

  if (cell.isMine) {
    newBoard.forEach((r) =>
      r.forEach((c) => {
        if (c.isMine) c.state = "revealed"
      }),
    )
    return { ...state, board: newBoard, gameOver: true, firstClick }
  }

  const revealRecursive = (r: number, c: number) => {
    if (r < 0 || r >= state.rows || c < 0 || c >= state.cols) return
    if (newBoard[r][c].state !== "hidden") return

    newBoard[r][c].state = "revealed"

    if (newBoard[r][c].adjacentMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealRecursive(r + i, c + j)
        }
      }
    }
  }

  revealRecursive(row, col)

  const revealedCount = newBoard.flat().filter((c) => c.state === "revealed").length
  const won = revealedCount === state.rows * state.cols - state.mines

  return {
    ...state,
    board: newBoard,
    firstClick,
    revealedCount,
    won,
    gameOver: won,
  }
}

export const toggleFlag = (state: MinesweeperState, row: number, col: number): MinesweeperState => {
  if (state.gameOver || state.board[row][col].state === "revealed") {
    return state
  }

  const newBoard = state.board.map((r) => r.map((c) => ({ ...c })))
  const cell = newBoard[row][col]

  if (cell.state === "hidden") {
    if (state.flagsPlaced >= state.mines) return state
    cell.state = "flagged"
    return { ...state, board: newBoard, flagsPlaced: state.flagsPlaced + 1 }
  } else if (cell.state === "flagged") {
    cell.state = "hidden"
    return { ...state, board: newBoard, flagsPlaced: state.flagsPlaced - 1 }
  }

  return state
}
