"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createInitialState, revealCell, toggleFlag, type Difficulty, type MinesweeperState } from "./logic"

interface MinesweeperGameProps {
  onGameEnd: (score: number, stats: { moves: number; time: number }) => void
  gameMode?: string
}

export default function MinesweeperGame({ onGameEnd, gameMode = "easy" }: MinesweeperGameProps) {
  const [state, setState] = useState<MinesweeperState>(createInitialState(gameMode as Difficulty))
  const [startTime] = useState(Date.now())
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    if (state.gameOver) {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
      const score = state.won ? 1000 - timeElapsed + state.revealedCount * 10 : 0
      onGameEnd(score, { moves, time: timeElapsed })
    }
  }, [state.gameOver, state.won, state.revealedCount, moves, startTime, onGameEnd])

  const handleCellClick = (row: number, col: number) => {
    if (!state.gameOver) {
      setState((prev) => revealCell(prev, row, col))
      setMoves((prev) => prev + 1)
    }
  }

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (!state.gameOver) {
      setState((prev) => toggleFlag(prev, row, col))
    }
  }

  const resetGame = () => {
    setState(createInitialState(gameMode as Difficulty))
    setMoves(0)
  }

  const getCellContent = (row: number, col: number) => {
    const cell = state.board[row][col]

    if (cell.state === "flagged") return "🚩"
    if (cell.state === "hidden") return ""
    if (cell.isMine) return "💣"
    if (cell.adjacentMines === 0) return ""
    return cell.adjacentMines
  }

  const getCellColor = (row: number, col: number) => {
    const cell = state.board[row][col]
    if (cell.state === "hidden" || cell.state === "flagged") return "bg-gray-400 hover:bg-gray-500"
    if (cell.isMine) return "bg-red-500"
    return "bg-gray-200"
  }

  const getNumberColor = (num: number) => {
    const colors = [
      "",
      "text-blue-600",
      "text-green-600",
      "text-red-600",
      "text-purple-600",
      "text-orange-600",
      "text-cyan-600",
      "text-black",
      "text-gray-600",
    ]
    return colors[num] || ""
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] gap-6 p-4">
      <div className="flex justify-between items-center w-full max-w-2xl">
        <Card className="p-3">
          <p className="text-sm text-muted-foreground">Mines</p>
          <p className="text-xl font-bold">
            {state.mines - state.flagsPlaced} / {state.mines}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-sm text-muted-foreground">Moves</p>
          <p className="text-xl font-bold">{moves}</p>
        </Card>
        <Button onClick={resetGame} variant="outline">
          New Game
        </Button>
      </div>

      {state.won && (
        <Card className="p-4 bg-green-100 border-green-500">
          <p className="text-center font-bold text-green-800">You won! All mines cleared!</p>
        </Card>
      )}

      {state.gameOver && !state.won && (
        <Card className="p-4 bg-red-100 border-red-500">
          <p className="text-center font-bold text-red-800">Game Over! You hit a mine!</p>
        </Card>
      )}

      <div
        className="grid gap-1 p-4 bg-gray-300 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${state.cols}, minmax(0, 1fr))`,
        }}
      >
        {state.board.map((row, i) =>
          row.map((cell, j) => (
            <button
              key={`${i}-${j}`}
              onClick={() => handleCellClick(i, j)}
              onContextMenu={(e) => handleCellRightClick(e, i, j)}
              className={`w-8 h-8 flex items-center justify-center rounded font-bold text-sm transition-all ${getCellColor(
                i,
                j,
              )} ${cell.state === "revealed" && !cell.isMine ? getNumberColor(cell.adjacentMines) : ""}`}
              disabled={state.gameOver}
            >
              {getCellContent(i, j)}
            </button>
          )),
        )}
      </div>

      <p className="text-sm text-muted-foreground text-center max-w-md">
        Left click to reveal cells. Right click to place flags. Clear all non-mine cells to win!
      </p>
    </div>
  )
}
