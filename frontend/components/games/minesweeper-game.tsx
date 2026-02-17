"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MinesweeperGameProps {
  onGameEnd: (score: number) => void
}

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

export function MinesweeperGame({ onGameEnd }: MinesweeperGameProps) {
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameOver, setGameOver] = useState(false)
  const [flagsLeft, setFlagsLeft] = useState(10)

  useEffect(() => {
    initBoard()
  }, [])

  function initBoard() {
    const newBoard: Cell[][] = Array(10)
      .fill(0)
      .map(() =>
        Array(10)
          .fill(0)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          })),
      )

    let minesPlaced = 0
    while (minesPlaced < 10) {
      const row = Math.floor(Math.random() * 10)
      const col = Math.floor(Math.random() * 10)
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true
        minesPlaced++
      }
    }

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (!newBoard[i][j].isMine) {
          let count = 0
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di
              const nj = j + dj
              if (ni >= 0 && ni < 10 && nj >= 0 && nj < 10 && newBoard[ni][nj].isMine) {
                count++
              }
            }
          }
          newBoard[i][j].neighborMines = count
        }
      }
    }

    setBoard(newBoard)
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || board[row][col].isRevealed || board[row][col].isFlagged) return

    const newBoard = board.map((r) => r.map((c) => ({ ...c })))

    if (newBoard[row][col].isMine) {
      newBoard[row][col].isRevealed = true
      setBoard(newBoard)
      setGameOver(true)
      setTimeout(() => onGameEnd(0), 1000)
      return
    }

    newBoard[row][col].isRevealed = true
    setBoard(newBoard)
  }

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (gameOver || board[row][col].isRevealed) return

    const newBoard = board.map((r) => r.map((c) => ({ ...c })))
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
    setBoard(newBoard)
    setFlagsLeft(flagsLeft + (newBoard[row][col].isFlagged ? -1 : 1))
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-between w-full max-w-md">
          <div className="text-lg font-semibold">Flags: {flagsLeft}</div>
          <Button onClick={initBoard}>New Game</Button>
        </div>

        <div className="grid grid-cols-10 gap-0 border-4 border-border">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                className={`w-10 h-10 flex items-center justify-center text-sm font-bold border border-border ${
                  cell.isRevealed
                    ? cell.isMine
                      ? "bg-red-500 text-white"
                      : "bg-gray-200"
                    : "bg-gray-400 hover:bg-gray-300"
                }`}
              >
                {cell.isFlagged ? "🚩" : cell.isRevealed ? (cell.isMine ? "💣" : cell.neighborMines || "") : ""}
              </button>
            )),
          )}
        </div>

        <p className="text-sm text-muted-foreground">Right-click to flag mines</p>
      </div>
    </Card>
  )
}
