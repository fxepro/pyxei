export type CheckersCell = "empty" | "red" | "red-king" | "black" | "black-king"
export type CheckersBoard = CheckersCell[][]
export type Player = "red" | "black"

export interface Move {
  from: { row: number; col: number }
  to: { row: number; col: number }
  captures?: { row: number; col: number }[]
}

export function createInitialBoard(): CheckersBoard {
  const board: CheckersBoard = Array(8)
    .fill(null)
    .map(() => Array(8).fill("empty"))

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = "black"
      }
    }
  }

  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = "red"
      }
    }
  }

  return board
}

export function isPlayerPiece(cell: CheckersCell, player: Player): boolean {
  return cell === player || cell === `${player}-king`
}

export function isKing(cell: CheckersCell): boolean {
  return cell === "red-king" || cell === "black-king"
}

export function getValidMoves(board: CheckersBoard, row: number, col: number, player: Player): Move[] {
  const piece = board[row][col]
  if (!isPlayerPiece(piece, player)) return []

  const moves: Move[] = []
  const isKingPiece = isKing(piece)
  const directions = isKingPiece
    ? [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]
    : player === "red"
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ]

  // Check regular moves
  for (const [dr, dc] of directions) {
    const newRow = row + dr
    const newCol = col + dc

    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (board[newRow][newCol] === "empty") {
        moves.push({
          from: { row, col },
          to: { row: newRow, col: newCol },
        })
      }
    }
  }

  // Check capture moves
  const captureMoves = getCaptureMoves(board, row, col, player)
  moves.push(...captureMoves)

  return moves
}

export function getCaptureMoves(board: CheckersBoard, row: number, col: number, player: Player): Move[] {
  const piece = board[row][col]
  if (!isPlayerPiece(piece, player)) return []

  const moves: Move[] = []
  const isKingPiece = isKing(piece)
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]

  for (const [dr, dc] of directions) {
    const jumpRow = row + dr
    const jumpCol = col + dc
    const landRow = row + dr * 2
    const landCol = col + dc * 2

    if (landRow >= 0 && landRow < 8 && landCol >= 0 && landCol < 8) {
      const jumpPiece = board[jumpRow][jumpCol]
      const opponent = player === "red" ? "black" : "red"

      if (isPlayerPiece(jumpPiece, opponent) && board[landRow][landCol] === "empty") {
        moves.push({
          from: { row, col },
          to: { row: landRow, col: landCol },
          captures: [{ row: jumpRow, col: jumpCol }],
        })
      }
    }
  }

  return moves
}

export function makeMove(board: CheckersBoard, move: Move): CheckersBoard {
  const newBoard = board.map((row) => [...row])
  const piece = newBoard[move.from.row][move.from.col]

  newBoard[move.from.row][move.from.col] = "empty"
  newBoard[move.to.row][move.to.col] = piece

  if (move.captures) {
    for (const capture of move.captures) {
      newBoard[capture.row][capture.col] = "empty"
    }
  }

  // Promote to king
  if (piece === "red" && move.to.row === 0) {
    newBoard[move.to.row][move.to.col] = "red-king"
  } else if (piece === "black" && move.to.row === 7) {
    newBoard[move.to.row][move.to.col] = "black-king"
  }

  return newBoard
}

export function getAllValidMoves(board: CheckersBoard, player: Player): Move[] {
  const moves: Move[] = []

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isPlayerPiece(board[row][col], player)) {
        moves.push(...getValidMoves(board, row, col, player))
      }
    }
  }

  // If there are capture moves, only return those (forced captures)
  const captureMoves = moves.filter((m) => m.captures && m.captures.length > 0)
  return captureMoves.length > 0 ? captureMoves : moves
}

export function checkWinner(board: CheckersBoard): Player | null {
  let redPieces = 0
  let blackPieces = 0

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isPlayerPiece(board[row][col], "red")) redPieces++
      if (isPlayerPiece(board[row][col], "black")) blackPieces++
    }
  }

  if (redPieces === 0) return "black"
  if (blackPieces === 0) return "red"

  return null
}

export function getAIMove(board: CheckersBoard, player: Player, difficulty: "easy" | "medium"): Move | null {
  const moves = getAllValidMoves(board, player)
  if (moves.length === 0) return null

  if (difficulty === "easy") {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  // Medium: Prefer captures and king promotions
  const captureMoves = moves.filter((m) => m.captures && m.captures.length > 0)
  if (captureMoves.length > 0) {
    return captureMoves[Math.floor(Math.random() * captureMoves.length)]
  }

  const kingMoves = moves.filter((m) => {
    const piece = board[m.from.row][m.from.col]
    return (piece === "black" && m.to.row === 7) || (piece === "red" && m.to.row === 0)
  })

  if (kingMoves.length > 0) {
    return kingMoves[Math.floor(Math.random() * kingMoves.length)]
  }

  return moves[Math.floor(Math.random() * moves.length)]
}
