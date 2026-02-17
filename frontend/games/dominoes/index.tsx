"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  initializeGame,
  canPlayDomino,
  playDomino,
  hasValidMove,
  calculateScore,
  getAIMove,
  type Domino,
  type GameState,
} from "./logic"

interface DominoesGameProps {
  onGameEnd?: (score: number) => void
  difficulty?: string
}

export default function DominoesGame({ onGameEnd, difficulty = "medium" }: DominoesGameProps) {
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
