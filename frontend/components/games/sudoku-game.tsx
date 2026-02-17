"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SudokuGameProps {
  onGameEnd: (score: number) => void
}

export function SudokuGame({ onGameEnd }: SudokuGameProps) {
  const [board, setBoard] = useState<number[][]>(generateSudoku())
  const [initialBoard, setInitialBoard] = useState<number[][]>([])
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [mistakes, setMistakes] = useState(0)

  useEffect(() => {
    const puzzle = generateSudoku()
    setBoard(puzzle)
    setInitialBoard(puzzle.map((row) => [...row]))
  }, [])

  function generateSudoku(): number[][] {
    const board = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0))
    const solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ]

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Math.random() > 0.4) {
          board[i][j] = solution[i][j]
        }
      }
    }
    return board
  }

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row][col] === 0) {
      setSelectedCell([row, col])
    }
  }

  const handleNumberInput = (num: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell
      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = num
      setBoard(newBoard)
    }
  }

  const checkComplete = () => {
    const filled = board.every((row) => row.every((cell) => cell !== 0))
    if (filled) {
      const score = Math.max(0, 100 - mistakes * 10)
      onGameEnd(score)
    }
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-between w-full max-w-2xl">
          <div className="text-lg font-semibold">Mistakes: {mistakes}</div>
          <Button onClick={checkComplete}>Check Solution</Button>
        </div>

        <div className="grid grid-cols-9 gap-0 border-4 border-border">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isInitial = initialBoard[rowIndex]?.[colIndex] !== 0
              const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`w-12 h-12 flex items-center justify-center text-lg font-semibold border border-border ${
                    isInitial ? "bg-secondary text-secondary-foreground" : "bg-background"
                  } ${isSelected ? "ring-2 ring-primary" : ""} ${
                    (colIndex + 1) % 3 === 0 && colIndex !== 8 ? "border-r-2 border-r-foreground" : ""
                  } ${
                    (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? "border-b-2 border-b-foreground" : ""
                  } hover:bg-accent`}
                >
                  {cell !== 0 ? cell : ""}
                </button>
              )
            }),
          )}
        </div>

        <div className="grid grid-cols-9 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button key={num} onClick={() => handleNumberInput(num)} variant="outline">
              {num}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
