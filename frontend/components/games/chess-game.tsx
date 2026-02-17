"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ChessGameProps {
  onGameEnd: (score: number) => void
}

export function ChessGame({ onGameEnd }: ChessGameProps) {
  const [board, setBoard] = useState<string[][]>(getInitialBoard())
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
  const [moves, setMoves] = useState(0)

  function getInitialBoard(): string[][] {
    return [
      ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
      ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
      ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
    ]
  }

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare
      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = newBoard[fromRow][fromCol]
      newBoard[fromRow][fromCol] = ""
      setBoard(newBoard)
      setSelectedSquare(null)
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
      setMoves(moves + 1)
    } else if (board[row][col]) {
      setSelectedSquare([row, col])
    }
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-between w-full max-w-2xl">
          <div className="text-lg font-semibold">
            Current Player: <span className="text-primary">{currentPlayer}</span>
          </div>
          <div className="text-lg font-semibold">Moves: {moves}</div>
        </div>

        <div className="grid grid-cols-8 gap-0 border-4 border-border">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0
              const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={`w-16 h-16 flex items-center justify-center text-4xl transition-colors ${
                    isLight ? "bg-amber-100" : "bg-amber-700"
                  } ${isSelected ? "ring-4 ring-primary" : ""} hover:opacity-80`}
                >
                  {piece}
                </button>
              )
            }),
          )}
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setBoard(getInitialBoard())}>Reset Board</Button>
          <Button variant="outline" onClick={() => onGameEnd(moves > 0 ? 100 - moves : 0)}>
            End Game
          </Button>
        </div>
      </div>
    </Card>
  )
}
