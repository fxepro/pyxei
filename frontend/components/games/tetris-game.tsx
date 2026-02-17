"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TetrisGameProps {
  onGameEnd: (score: number) => void
}

export function TetrisGame({ onGameEnd }: TetrisGameProps) {
  const [board, setBoard] = useState<number[][]>(
    Array(20)
      .fill(0)
      .map(() => Array(10).fill(0)),
  )
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [currentPiece, setCurrentPiece] = useState({ x: 4, y: 0, shape: [[1, 1, 1, 1]] })

  const movePiece = useCallback((dx: number, dy: number) => {
    setCurrentPiece((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
  }, [])

  useEffect(() => {
    if (!gameActive) return

    const interval = setInterval(() => {
      movePiece(0, 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [gameActive, movePiece])

  const startGame = () => {
    setGameActive(true)
    setScore(0)
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-between w-full max-w-md">
          <div className="text-lg font-semibold">Score: {score}</div>
          {!gameActive && <Button onClick={startGame}>Start Game</Button>}
        </div>

        <div className="grid grid-cols-10 gap-0 border-4 border-border bg-black">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 border border-gray-800 ${cell ? "bg-blue-500" : "bg-gray-900"}`}
              />
            )),
          )}
        </div>

        <div className="flex gap-4">
          <Button onClick={() => movePiece(-1, 0)}>←</Button>
          <Button onClick={() => movePiece(0, 1)}>↓</Button>
          <Button onClick={() => movePiece(1, 0)}>→</Button>
        </div>

        <Button variant="outline" onClick={() => onGameEnd(score)}>
          End Game
        </Button>
      </div>
    </Card>
  )
}
