"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Domino {
  id: string
  left: number
  right: number
  played: boolean
}

interface GameState {
  playerHand: Domino[]
  aiHand: Domino[]
  board: Domino[]
  playerScore: number
  aiScore: number
  currentPlayer: "player" | "ai"
  gameOver: boolean
  winner: string | null
}

function createDominoSet(): Domino[] {
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

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function initializeGame(): GameState {
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

function canPlayDomino(domino: Domino, board: Domino[]): { left: boolean; right: boolean } {
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

function playDomino(domino: Domino, board: Domino[], side: "left" | "right"): Domino[] {
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

function hasValidMove(hand: Domino[], board: Domino[]): boolean {
  if (board.length === 0) return hand.length > 0

  return hand.some((domino) => {
    const canPlay = canPlayDomino(domino, board)
    return canPlay.left || canPlay.right
  })
}

function calculateScore(hand: Domino[]): number {
  return hand.reduce((sum, domino) => sum + domino.left + domino.right, 0)
}

function getAIMove(aiHand: Domino[], board: Domino[]): { domino: Domino; side: "left" | "right" } | null {
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

interface DominoesGameProps {
  onGameEnd: (score: number) => void
  difficulty?: string
}

export function DominoesGame({ onGameEnd, difficulty = "medium" }: DominoesGameProps) {
  const [gameState, setGameState] = useState<GameState>(initializeGame())
  const [selectedDomino, setSelectedDomino] = useState<Domino | null>(null)
  const [message, setMessage] = useState("Your turn! Click a domino to play.")

  useEffect(() => {
    if (gameState.currentPlayer === "ai" && !gameState.gameOver) {
      const timer = setTimeout(() => {
        handleAITurn()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameState.currentPlayer, gameState.gameOver])

  useEffect(() => {
    if (gameState.gameOver && onGameEnd) {
      const score = gameState.winner === "player" ? 1000 - gameState.playerScore * 10 : 0
      onGameEnd(score)
    }
  }, [gameState.gameOver])

  const handleAITurn = () => {
    const aiMove = getAIMove(gameState.aiHand, gameState.board)

    if (aiMove) {
      const newBoard = playDomino(aiMove.domino, gameState.board, aiMove.side)
      const newAIHand = gameState.aiHand.filter((d) => d.id !== aiMove.domino.id)

      if (newAIHand.length === 0) {
        setGameState({
          ...gameState,
          board: newBoard,
          aiHand: newAIHand,
          gameOver: true,
          winner: "ai",
          currentPlayer: "player",
        })
        setMessage("AI wins!")
        return
      }

      setGameState({
        ...gameState,
        board: newBoard,
        aiHand: newAIHand,
        currentPlayer: "player",
      })
      setMessage("Your turn!")
    } else {
      if (!hasValidMove(gameState.playerHand, gameState.board)) {
        const playerScore = calculateScore(gameState.playerHand)
        const aiScore = calculateScore(gameState.aiHand)

        setGameState({
          ...gameState,
          playerScore,
          aiScore,
          gameOver: true,
          winner: playerScore < aiScore ? "player" : "ai",
          currentPlayer: "player",
        })
        setMessage(playerScore < aiScore ? "You win!" : "AI wins!")
      } else {
        setGameState({
          ...gameState,
          currentPlayer: "player",
        })
        setMessage("AI passed. Your turn!")
      }
    }
  }

  const handleDominoClick = (domino: Domino) => {
    if (gameState.currentPlayer !== "player" || gameState.gameOver) return

    const canPlay = canPlayDomino(domino, gameState.board)

    if (!canPlay.left && !canPlay.right && gameState.board.length > 0) {
      setMessage("Can't play this domino!")
      return
    }

    setSelectedDomino(domino)
    setMessage("Choose which side to play on (or click again to deselect)")
  }

  const handlePlaySide = (side: "left" | "right") => {
    if (!selectedDomino || gameState.currentPlayer !== "player") return

    const canPlay = canPlayDomino(selectedDomino, gameState.board)

    if ((side === "left" && !canPlay.left) || (side === "right" && !canPlay.right)) {
      if (gameState.board.length > 0) {
        setMessage("Can't play on this side!")
        return
      }
    }

    const newBoard = playDomino(selectedDomino, gameState.board, side)
    const newPlayerHand = gameState.playerHand.filter((d) => d.id !== selectedDomino.id)

    if (newPlayerHand.length === 0) {
      setGameState({
        ...gameState,
        board: newBoard,
        playerHand: newPlayerHand,
        gameOver: true,
        winner: "player",
      })
      setMessage("You win!")
      return
    }

    setGameState({
      ...gameState,
      board: newBoard,
      playerHand: newPlayerHand,
      currentPlayer: "ai",
    })
    setSelectedDomino(null)
    setMessage("AI's turn...")
  }

  const handlePass = () => {
    if (gameState.currentPlayer !== "player" || gameState.gameOver) return

    if (hasValidMove(gameState.playerHand, gameState.board)) {
      setMessage("You have valid moves!")
      return
    }

    setGameState({
      ...gameState,
      currentPlayer: "ai",
    })
    setMessage("AI's turn...")
  }

  const handleNewGame = () => {
    setGameState(initializeGame())
    setSelectedDomino(null)
    setMessage("Your turn! Click a domino to play.")
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex items-center justify-between w-full max-w-4xl">
        <div className="text-lg font-semibold">AI Hand: {gameState.aiHand.length} dominoes</div>
        <div className="text-lg font-semibold">Your Hand: {gameState.playerHand.length} dominoes</div>
      </div>

      <Card className="p-4 w-full max-w-4xl">
        <div className="text-center mb-4 font-medium">{message}</div>

        <div className="flex items-center justify-center gap-2 min-h-[120px] overflow-x-auto pb-4">
          {gameState.board.length === 0 ? (
            <div className="text-muted-foreground">Board is empty - play any domino</div>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePlaySide("left")}
                disabled={!selectedDomino || gameState.currentPlayer !== "player"}
              >
                ← Play Left
              </Button>

              <div className="flex gap-1 items-center">
                {gameState.board.map((domino, index) => (
                  <DominoTile key={`${domino.id}-${index}`} domino={domino} />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePlaySide("right")}
                disabled={!selectedDomino || gameState.currentPlayer !== "player"}
              >
                Play Right →
              </Button>
            </>
          )}
        </div>
      </Card>

      <div className="w-full max-w-4xl">
        <div className="text-sm font-medium mb-2">Your Hand:</div>
        <div className="flex flex-wrap gap-2">
          {gameState.playerHand.map((domino) => (
            <button
              key={domino.id}
              onClick={() => handleDominoClick(domino)}
              disabled={gameState.currentPlayer !== "player" || gameState.gameOver}
              className={`transition-transform hover:scale-105 ${
                selectedDomino?.id === domino.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <DominoTile domino={domino} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handlePass} disabled={gameState.currentPlayer !== "player" || gameState.gameOver}>
          Pass Turn
        </Button>
        <Button onClick={handleNewGame} variant="outline">
          New Game
        </Button>
      </div>

      {gameState.gameOver && (
        <Card className="p-6 w-full max-w-md text-center">
          <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
          <p className="text-lg mb-4">{gameState.winner === "player" ? "You Win!" : "AI Wins!"}</p>
          <div className="text-sm text-muted-foreground">
            <p>Your Score: {gameState.playerScore}</p>
            <p>AI Score: {gameState.aiScore}</p>
          </div>
        </Card>
      )}
    </div>
  )
}

function DominoTile({ domino }: { domino: Domino }) {
  return (
    <div className="flex flex-col bg-background border-2 border-foreground rounded-lg w-16 h-24 overflow-hidden">
      <div className="flex-1 flex items-center justify-center border-b border-foreground">
        <DominoDots count={domino.left} />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <DominoDots count={domino.right} />
      </div>
    </div>
  )
}

function DominoDots({ count }: { count: number }) {
  const dotPositions: Record<number, string[]> = {
    0: [],
    1: ["center"],
    2: ["top-left", "bottom-right"],
    3: ["top-left", "center", "bottom-right"],
    4: ["top-left", "top-right", "bottom-left", "bottom-right"],
    5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
    6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
  }

  const positions = dotPositions[count] || []

  return (
    <div className="relative w-12 h-12">
      {positions.map((pos, i) => (
        <div key={i} className={`absolute w-2 h-2 bg-foreground rounded-full ${getPositionClass(pos)}`} />
      ))}
    </div>
  )
}

function getPositionClass(position: string): string {
  const classes: Record<string, string> = {
    "top-left": "top-1 left-1",
    "top-right": "top-1 right-1",
    "middle-left": "top-1/2 -translate-y-1/2 left-1",
    "middle-right": "top-1/2 -translate-y-1/2 right-1",
    "bottom-left": "bottom-1 left-1",
    "bottom-right": "bottom-1 right-1",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  }
  return classes[position] || ""
}
