"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  createEmptyBoard,
  getRandomPiece,
  canMove,
  rotatePiece,
  mergePiece,
  clearLines,
  calculateScore,
  type TetrisBoard,
  type TetrisPiece,
} from "./logic"

interface TetrisGameProps {
  onGameEnd: (score: number) => void
}

const COLORS = [
  "bg-gray-800",
  "bg-cyan-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-red-500",
  "bg-blue-500",
  "bg-orange-500",
]

export default function TetrisGame({ onGameEnd }: TetrisGameProps) {
  const [board, setBoard] = useState<TetrisBoard>(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState<TetrisPiece>(getRandomPiece())
  const [nextPiece, setNextPiece] = useState<TetrisPiece>(getRandomPiece())
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(0)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const moveDown = useCallback(() => {
    if (gameOver || isPaused) return

    if (canMove(board, currentPiece, 0, 1)) {
      setCurrentPiece((prev) => ({ ...prev, y: prev.y + 1 }))
    } else {
      const newBoard = mergePiece(board, currentPiece)
      const { board: clearedBoard, linesCleared } = clearLines(newBoard)

      setBoard(clearedBoard)
      setLines((prev) => prev + linesCleared)
      setScore((prev) => prev + calculateScore(linesCleared, level))
      setLevel(Math.floor((lines + linesCleared) / 10))

      setCurrentPiece(nextPiece)
      setNextPiece(getRandomPiece())

      if (!canMove(clearedBoard, nextPiece, 0, 0)) {
        setGameOver(true)
        onGameEnd(score)
      }
    }
  }, [board, currentPiece, nextPiece, gameOver, isPaused, level, lines, score, onGameEnd])

  const moveLeft = () => {
    if (canMove(board, currentPiece, -1, 0)) {
      setCurrentPiece((prev) => ({ ...prev, x: prev.x - 1 }))
    }
  }

  const moveRight = () => {
    if (canMove(board, currentPiece, 1, 0)) {
      setCurrentPiece((prev) => ({ ...prev, x: prev.x + 1 }))
    }
  }

  const rotate = () => {
    const rotated = rotatePiece(currentPiece)
    if (canMove(board, rotated, 0, 0)) {
      setCurrentPiece(rotated)
    }
  }

  const hardDrop = () => {
    const newPiece = { ...currentPiece }
    while (canMove(board, newPiece, 0, 1)) {
      newPiece.y++
    }
    setCurrentPiece(newPiece)
    moveDown()
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return

      switch (e.key) {
        case "ArrowLeft":
          moveLeft()
          break
        case "ArrowRight":
          moveRight()
          break
        case "ArrowDown":
          moveDown()
          break
        case "ArrowUp":
          rotate()
          break
        case " ":
          hardDrop()
          break
        case "p":
          setIsPaused((prev) => !prev)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentPiece, board, gameOver, moveDown])

  useEffect(() => {
    if (gameOver || isPaused) return

    const speed = Math.max(100, 1000 - level * 100)
    const interval = setInterval(moveDown, speed)
    return () => clearInterval(interval)
  }, [moveDown, level, gameOver, isPaused])

  const displayBoard = mergePiece(board, currentPiece)

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex gap-8 items-start">
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Score:</span>
                <span className="font-bold">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lines:</span>
                <span className="font-bold">{lines}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level:</span>
                <span className="font-bold">{level}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-semibold mb-2">Next Piece</div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(4, 1.5rem)` }}>
              {Array(4)
                .fill(null)
                .map((_, y) =>
                  Array(4)
                    .fill(null)
                    .map((_, x) => {
                      const inPiece = nextPiece.shape[y]?.[x]
                      return (
                        <div
                          key={`${y}-${x}`}
                          className={`w-6 h-6 border ${inPiece ? COLORS[nextPiece.color] : "bg-gray-900"}`}
                        />
                      )
                    }),
                )}
            </div>
          </Card>
        </div>

        <div className="relative">
          <div className="grid gap-[1px] bg-gray-700 p-1 rounded" style={{ gridTemplateColumns: `repeat(10, 1.5rem)` }}>
            {displayBoard.map((row, y) =>
              row.map((cell, x) => (
                <div key={`${y}-${x}`} className={`w-6 h-6 ${COLORS[cell]} border border-gray-800`} />
              )),
            )}
          </div>

          {(gameOver || isPaused) && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-2">{gameOver ? "Game Over!" : "Paused"}</div>
                {gameOver && <div className="text-lg">Score: {score}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button onClick={moveLeft} disabled={gameOver}>
            ←
          </Button>
          <Button onClick={rotate} disabled={gameOver}>
            ↻
          </Button>
          <Button onClick={moveRight} disabled={gameOver}>
            →
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={moveDown} disabled={gameOver}>
            ↓ Down
          </Button>
          <Button onClick={hardDrop} disabled={gameOver}>
            ⬇ Drop
          </Button>
          <Button onClick={() => setIsPaused(!isPaused)} disabled={gameOver}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        <div>Use arrow keys to move and rotate</div>
        <div>Space for hard drop • P to pause</div>
      </div>
    </div>
  )
}
