"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Match3GameProps {
  onGameEnd: (score: number) => void
}

const GEMS = ["💎", "💚", "💙", "💜", "❤️", "🧡"]

export function Match3Game({ onGameEnd }: Match3GameProps) {
  const [board, setBoard] = useState<string[][]>([])
  const [score, setScore] = useState(0)
  const [selectedGem, setSelectedGem] = useState<[number, number] | null>(null)
  const [moves, setMoves] = useState(20)

  useEffect(() => {
    setBoard(generateBoard())
  }, [])

  function generateBoard(): string[][] {
    return Array(8)
      .fill(0)
      .map(() =>
        Array(8)
          .fill(0)
          .map(() => GEMS[Math.floor(Math.random() * GEMS.length)]),
      )
  }

  const handleGemClick = (row: number, col: number) => {
    if (moves === 0) return

    if (!selectedGem) {
      setSelectedGem([row, col])
    } else {
      const [selectedRow, selectedCol] = selectedGem
      const isAdjacent =
        (Math.abs(row - selectedRow) === 1 && col === selectedCol) ||
        (Math.abs(col - selectedCol) === 1 && row === selectedRow)

      if (isAdjacent) {
        const newBoard = board.map((r) => [...r])
        const temp = newBoard[row][col]
        newBoard[row][col] = newBoard[selectedRow][selectedCol]
        newBoard[selectedRow][selectedCol] = temp
        setBoard(newBoard)
        setMoves(moves - 1)
        setScore(score + 10)
      }
      setSelectedGem(null)
    }
  }

  useEffect(() => {
    if (moves === 0) {
      setTimeout(() => onGameEnd(score), 1000)
    }
  }, [moves])

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-between w-full max-w-2xl">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="text-lg font-semibold">Moves: {moves}</div>
        </div>

        <div className="grid grid-cols-8 gap-1">
          {board.map((row, rowIndex) =>
            row.map((gem, colIndex) => {
              const isSelected = selectedGem && selectedGem[0] === rowIndex && selectedGem[1] === colIndex
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleGemClick(rowIndex, colIndex)}
                  className={`w-14 h-14 flex items-center justify-center text-3xl bg-secondary rounded-lg transition-all ${
                    isSelected ? "ring-4 ring-primary scale-110" : ""
                  } hover:scale-105`}
                >
                  {gem}
                </button>
              )
            }),
          )}
        </div>

        <Button onClick={() => onGameEnd(score)}>End Game</Button>
      </div>
    </Card>
  )
}
