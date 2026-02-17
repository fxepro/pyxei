"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createInitialState, move, getTileColor, type Direction, type Game2048State } from "./logic"

interface Game2048Props {
  onGameEnd: (score: number, stats: { moves: number; time: number }) => void
}

export default function Game2048({ onGameEnd }: Game2048Props) {
  const [state, setState] = useState<Game2048State>(createInitialState())
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameOver) return

      let direction: Direction | null = null
      switch (e.key) {
        case "ArrowUp":
          direction = "up"
          break
        case "ArrowDown":
          direction = "down"
          break
        case "ArrowLeft":
          direction = "left"
          break
        case "ArrowRight":
          direction = "right"
          break
      }

      if (direction) {
        e.preventDefault()
        setState((prev) => move(prev, direction!))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [state.gameOver])

  useEffect(() => {
    if (state.gameOver) {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
      onGameEnd(state.score, { moves: state.moves, time: timeElapsed })
    }
  }, [state.gameOver, state.score, state.moves, startTime, onGameEnd])

  const handleMove = (direction: Direction) => {
    if (!state.gameOver) {
      setState((prev) => move(prev, direction))
    }
  }

  const resetGame = () => {
    setState(createInitialState())
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] gap-6 p-4">
      <div className="flex justify-between items-center w-full max-w-md">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-2xl font-bold">{state.score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Moves</p>
          <p className="text-2xl font-bold">{state.moves}</p>
        </div>
        <Button onClick={resetGame} variant="outline">
          New Game
        </Button>
      </div>

      {state.won && !state.gameOver && (
        <Card className="p-4 bg-green-100 border-green-500">
          <p className="text-center font-bold text-green-800">You reached 2048! Keep going!</p>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-2 p-4 bg-gray-200 rounded-lg">
        {state.board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-xl transition-all ${
                cell === 0 ? "bg-gray-300" : getTileColor(cell)
              }`}
            >
              {cell !== 0 && cell}
            </div>
          )),
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs">
        <div />
        <Button onClick={() => handleMove("up")} size="lg" disabled={state.gameOver}>
          ↑
        </Button>
        <div />
        <Button onClick={() => handleMove("left")} size="lg" disabled={state.gameOver}>
          ←
        </Button>
        <Button onClick={() => handleMove("down")} size="lg" disabled={state.gameOver}>
          ↓
        </Button>
        <Button onClick={() => handleMove("right")} size="lg" disabled={state.gameOver}>
          →
        </Button>
      </div>

      <p className="text-sm text-muted-foreground text-center max-w-md">
        Use arrow keys or buttons to move tiles. Combine tiles with the same number to create larger numbers. Reach 2048
        to win!
      </p>
    </div>
  )
}
