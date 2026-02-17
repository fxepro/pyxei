"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  createBoard,
  canSwap,
  swapGems,
  findMatches,
  removeMatches,
  applyGravity,
  fillEmpty,
  calculateScore,
  type Board,
  type Gem,
} from "./logic"

interface Match3GameProps {
  onGameEnd: (score: number) => void
  difficulty?: string
}

export default function Match3Game({ onGameEnd, difficulty = "medium" }: Match3GameProps) {
  const [board, setBoard] = useState<Board>(createBoard())
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [movesLeft, setMovesLeft] = useState(difficulty === "easy" ? 30 : difficulty === "hard" ? 15 : 20)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (movesLeft === 0 && !gameOver) {
      setGameOver(true)
      onGameEnd(board.score)
    }
  }, [movesLeft, gameOver, board.score, onGameEnd])

  const handleCellClick = async (row: number, col: number) => {
    if (isProcessing || gameOver) return

    if (!selectedCell) {
      setSelectedCell({ row, col })
    } else {
      if (selectedCell.row === row && selectedCell.col === col) {
        setSelectedCell(null)
        return
      }

      if (canSwap(board.grid, selectedCell.row, selectedCell.col, row, col)) {
        setIsProcessing(true)

        const newGrid = swapGems(board.grid, selectedCell.row, selectedCell.col, row, col)
        setBoard({ ...board, grid: newGrid, moves: board.moves + 1 })
        setMovesLeft((prev) => prev - 1)

        await processMatches(newGrid)

        setIsProcessing(false)
      }

      setSelectedCell(null)
    }
  }

  const processMatches = async (grid: Gem[][]) => {
    let currentGrid = grid
    let totalScore = board.score

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const matches = findMatches(currentGrid)
      if (matches.length === 0) break

      totalScore += calculateScore(matches.length)
      currentGrid = removeMatches(currentGrid, matches)
      setBoard((prev) => ({ ...prev, grid: currentGrid, score: totalScore }))

      await new Promise((resolve) => setTimeout(resolve, 300))

      currentGrid = applyGravity(currentGrid)
      setBoard((prev) => ({ ...prev, grid: currentGrid }))

      await new Promise((resolve) => setTimeout(resolve, 300))

      currentGrid = fillEmpty(currentGrid)
      setBoard((prev) => ({ ...prev, grid: currentGrid }))
    }
  }

  const handleReset = () => {
    setBoard(createBoard())
    setSelectedCell(null)
    setIsProcessing(false)
    setMovesLeft(difficulty === "easy" ? 30 : difficulty === "hard" ? 15 : 20)
    setGameOver(false)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex gap-8 text-lg font-semibold">
        <div>Score: {board.score}</div>
        <div>Moves: {movesLeft}</div>
      </div>

      <div className="grid gap-1 bg-muted p-4 rounded-lg">
        {board.grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((gem, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={isProcessing || gameOver}
                className={`
                  w-12 h-12 text-3xl flex items-center justify-center
                  rounded-lg transition-all duration-200
                  ${
                    selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? "bg-primary scale-110 ring-2 ring-primary"
                      : "bg-background hover:bg-accent hover:scale-105"
                  }
                  ${isProcessing || gameOver ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {gem}
              </button>
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">Game Over!</div>
          <div className="text-xl">Final Score: {board.score}</div>
          <Button onClick={handleReset}>Play Again</Button>
        </div>
      )}
    </div>
  )
}
