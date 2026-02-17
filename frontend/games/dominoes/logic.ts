export interface Domino {
  id: string
  left: number
  right: number
  played: boolean
}

export interface GameState {
  playerHand: Domino[]
  aiHand: Domino[]
  board: Domino[]
  playerScore: number
  aiScore: number
  currentPlayer: "player" | "ai"
  gameOver: boolean
  winner: string | null
}

export function createDominoSet(): Domino[] {
  const dominoes: Domino[] = []
  let id = 0

  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      dominoes.push({
        id: `domino-${id++}`,
        left: i,
        right: j,
        played: false,
      })
    }
  }

  return shuffleArray(dominoes)
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function initializeGame(): GameState {
  const dominoes = createDominoSet()

  return {
    playerHand: dominoes.slice(0, 7),
    aiHand: dominoes.slice(7, 14),
    board: [],
    playerScore: 0,
    aiScore: 0,
    currentPlayer: "player",
    gameOver: false,
    winner: null,
  }
}

export function canPlayDomino(domino: Domino, board: Domino[]): { left: boolean; right: boolean } {
  if (board.length === 0) {
    return { left: true, right: true }
  }

  const leftEnd = board[0].left
  const rightEnd = board[board.length - 1].right

  return {
    left: domino.left === leftEnd || domino.right === leftEnd,
    right: domino.left === rightEnd || domino.right === rightEnd,
  }
}

export function playDomino(domino: Domino, board: Domino[], side: "left" | "right"): Domino[] {
  const newBoard = [...board]

  if (board.length === 0) {
    return [domino]
  }

  if (side === "left") {
    const leftEnd = board[0].left
    const flipped = domino.right === leftEnd ? domino : { ...domino, left: domino.right, right: domino.left }
    newBoard.unshift(flipped)
  } else {
    const rightEnd = board[board.length - 1].right
    const flipped = domino.left === rightEnd ? domino : { ...domino, left: domino.right, right: domino.left }
    newBoard.push(flipped)
  }

  return newBoard
}

export function hasValidMove(hand: Domino[], board: Domino[]): boolean {
  if (board.length === 0) return hand.length > 0

  return hand.some((domino) => {
    const canPlay = canPlayDomino(domino, board)
    return canPlay.left || canPlay.right
  })
}

export function calculateScore(hand: Domino[]): number {
  return hand.reduce((sum, domino) => sum + domino.left + domino.right, 0)
}

export function getAIMove(aiHand: Domino[], board: Domino[]): { domino: Domino; side: "left" | "right" } | null {
  for (const domino of aiHand) {
    const canPlay = canPlayDomino(domino, board)

    if (canPlay.left) {
      return { domino, side: "left" }
    }
    if (canPlay.right) {
      return { domino, side: "right" }
    }
  }

  return null
}
