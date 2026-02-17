export type Direction = "up" | "down" | "left" | "right"
export type Board = number[][]

export interface Game2048State {
  board: Board
  score: number
  gameOver: boolean
  won: boolean
  moves: number
}

const BOARD_SIZE = 4

export const createEmptyBoard = (): Board => {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(0))
}

export const addRandomTile = (board: Board): Board => {
  const emptyCells: [number, number][] = []
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === 0) {
        emptyCells.push([i, j])
      }
    }
  }

  if (emptyCells.length === 0) return board

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  const newBoard = board.map((row) => [...row])
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4
  return newBoard
}

export const createInitialState = (): Game2048State => {
  let board = createEmptyBoard()
  board = addRandomTile(board)
  board = addRandomTile(board)

  return {
    board,
    score: 0,
    gameOver: false,
    won: false,
    moves: 0,
  }
}

const rotateBoard = (board: Board): Board => {
  const newBoard = createEmptyBoard()
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      newBoard[i][j] = board[BOARD_SIZE - 1 - j][i]
    }
  }
  return newBoard
}

const slideLeft = (board: Board): { board: Board; score: number; moved: boolean } => {
  let score = 0
  let moved = false
  const newBoard = board.map((row) => {
    const filtered = row.filter((cell) => cell !== 0)
    const merged: number[] = []

    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2)
        score += filtered[i] * 2
        i++
      } else {
        merged.push(filtered[i])
      }
    }

    while (merged.length < BOARD_SIZE) {
      merged.push(0)
    }

    if (JSON.stringify(row) !== JSON.stringify(merged)) {
      moved = true
    }

    return merged
  })

  return { board: newBoard, score, moved }
}

export const move = (state: Game2048State, direction: Direction): Game2048State => {
  let board = state.board.map((row) => [...row])
  let rotations = 0

  switch (direction) {
    case "left":
      rotations = 0
      break
    case "up":
      rotations = 1
      break
    case "right":
      rotations = 2
      break
    case "down":
      rotations = 3
      break
  }

  for (let i = 0; i < rotations; i++) {
    board = rotateBoard(board)
  }

  const { board: newBoard, score: addedScore, moved } = slideLeft(board)

  for (let i = 0; i < BOARD_SIZE - rotations; i++) {
    board = rotateBoard(newBoard)
  }

  if (!moved) return state

  const boardWithNewTile = addRandomTile(board)
  const won = boardWithNewTile.some((row) => row.some((cell) => cell === 2048))
  const gameOver = !canMove(boardWithNewTile)

  return {
    board: boardWithNewTile,
    score: state.score + addedScore,
    gameOver,
    won: won || state.won,
    moves: state.moves + 1,
  }
}

export const canMove = (board: Board): boolean => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === 0) return true
      if (j < BOARD_SIZE - 1 && board[i][j] === board[i][j + 1]) return true
      if (i < BOARD_SIZE - 1 && board[i][j] === board[i + 1][j]) return true
    }
  }
  return false
}

export const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: "bg-amber-100 text-amber-900",
    4: "bg-amber-200 text-amber-900",
    8: "bg-orange-300 text-white",
    16: "bg-orange-400 text-white",
    32: "bg-orange-500 text-white",
    64: "bg-red-400 text-white",
    128: "bg-yellow-400 text-white",
    256: "bg-yellow-500 text-white",
    512: "bg-yellow-600 text-white",
    1024: "bg-yellow-700 text-white",
    2048: "bg-yellow-800 text-white",
  }
  return colors[value] || "bg-gray-800 text-white"
}
