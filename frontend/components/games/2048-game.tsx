"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Game2048Props {
  onGameEnd: (score: number) => void
}

export function Game2048({ onGameEnd }: Game2048Props) {
  const [board, setBoard] = useState<number[][]>(initBoard())
  const [score, setScore] = useState(0)

  function initBoard(): number[][] {
    const newBoard = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0))
    addRandomTile(newBoard)
    addRandomTile(newBoard)
    return newBoard
  }

  function addRandomTile(board: number[][]) {
    const empty: [number, number][] = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) empty.push([i, j])
      }
    }
    if (empty.length > 0) {
      const [row, col] = empty[Math.floor(Math.random() * empty.length)]
      board[row][col] = Math.random() < 0.9 ? 2 : 4
    }
  }

  const move = (direction: "up" | "down" | "left" | "right") => {
    const newBoard = board.map((row) => [...row])
    let moved = false

    if (direction === "left") {
      for (let i = 0; i < 4; i++) {
        const row = newBoard[i].filter((x) => x !== 0)
        for (let j = 0; j < row.length - 1; j++) {
          if (row[j] === row[j + 1]) {
            row[j] *= 2
            setScore((s) => s + row[j])
            row.splice(j + 1, 1)
          }
        }
        while (row.length < 4) row.push(0)
        if (JSON.stringify(row) !== JSON.stringify(newBoard[i])) moved = true
        newBoard[i] = row
      }
    }

    if (moved) {
      addRandomTile(newBoard)
      setBoard(newBoard)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move("left")
      if (e.key === "ArrowRight") move("right")
      if (e.key === "ArrowUp") move("up")
      if (e.key === "ArrowDown") move("down")
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [board])

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      2: "bg-yellow-200",
      4: "bg-yellow-300",
      8: "bg-orange-300",
      16: "bg-orange-400",
      32: "bg-red-400",
      64: "bg-red-500",
      128: "bg-yellow-500",
      256: "bg-yellow-600",
      512: "bg-yellow-700",
      1024: "bg-orange-600",
      2048: "bg-orange-700",
    }
    return colors[value] || "bg-gray-700"
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-between w-full max-w-md">
          <div className="text-2xl font-bold">Score: {score}</div>
          <Button onClick={() => setBoard(initBoard())}>New Game</Button>
        </div>

        <div className="grid grid-cols-4 gap-2 p-4 bg-amber-800 rounded-lg">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded ${
                  cell ? getTileColor(cell) : "bg-amber-900"
                } text-white`}
              >
                {cell || ""}
              </div>
            )),
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div />
          <Button onClick={() => move("up")}>↑</Button>
          <div />
          <Button onClick={() => move("left")}>←</Button>
          <Button onClick={() => move("down")}>↓</Button>
          <Button onClick={() => move("right")}>→</Button>
        </div>

        <Button variant="outline" onClick={() => onGameEnd(score)}>
          End Game
        </Button>
      </div>
    </Card>
  )
}
