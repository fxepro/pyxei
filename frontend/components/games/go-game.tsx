"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface GoGameProps {
  onGameEnd: (score: number) => void
}

type Player = "black" | "white" | null
type Board = Player[][]

export function GoGame({ onGameEnd }: GoGameProps) {
  const BOARD_SIZE = 9
  const [board, setBoard] = useState<Board>(() =>
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"black" | "white">("black")
  const [captured, setCaptured] = useState({ black: 0, white: 0 })
  const [passes, setPasses] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [startTime] = useState(Date.now())

  const getNeighbors = (row: number, col: number): [number, number][] => {
    const neighbors: [number, number][] = []
    if (row > 0) neighbors.push([row - 1, col])
    if (row < BOARD_SIZE - 1) neighbors.push([row + 1, col])
    if (col > 0) neighbors.push([row, col - 1])
    if (col < BOARD_SIZE - 1) neighbors.push([row, col + 1])
    return neighbors
  }

  const getGroup = (row: number, col: number, board: Board): Set<string> => {
    const color = board[row][col]
    if (!color) return new Set()

    const group = new Set<string>()
    const stack: [number, number][] = [[row, col]]

    while (stack.length > 0) {
      const [r, c] = stack.pop()!
      const key = `${r},${c}`
      if (group.has(key)) continue
      group.add(key)

      for (const [nr, nc] of getNeighbors(r, c)) {
        if (board[nr][nc] === color && !group.has(`${nr},${nc}`)) {
          stack.push([nr, nc])
        }
      }
    }

    return group
  }

  const hasLiberties = (group: Set<string>, board: Board): boolean => {
    for (const key of group) {
      const [row, col] = key.split(",").map(Number)
      for (const [nr, nc] of getNeighbors(row, col)) {
        if (board[nr][nc] === null) return true
      }
    }
    return false
  }

  const removeGroup = (group: Set<string>, board: Board): Board => {
    const newBoard = board.map((row) => [...row])
    for (const key of group) {
      const [row, col] = key.split(",").map(Number)
      newBoard[row][col] = null
    }
    return newBoard
  }

  const handleMove = (row: number, col: number) => {
    if (board[row][col] !== null || gameOver) return

    let newBoard = board.map((row) => [...row])
    newBoard[row][col] = currentPlayer

    const opponent = currentPlayer === "black" ? "white" : "black"
    let capturedCount = 0

    for (const [nr, nc] of getNeighbors(row, col)) {
      if (newBoard[nr][nc] === opponent) {
        const group = getGroup(nr, nc, newBoard)
        if (!hasLiberties(group, newBoard)) {
          newBoard = removeGroup(group, newBoard)
          capturedCount += group.size
        }
      }
    }

    const playerGroup = getGroup(row, col, newBoard)
    if (!hasLiberties(playerGroup, newBoard)) {
      return
    }

    setBoard(newBoard)
    setCaptured((prev) => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] + capturedCount,
    }))
    setCurrentPlayer(opponent)
    setPasses(0)
  }

  const handlePass = () => {
    const newPasses = passes + 1
    setPasses(newPasses)
    if (newPasses >= 2) {
      setGameOver(true)
      setShowResults(true)
    } else {
      setCurrentPlayer(currentPlayer === "black" ? "white" : "black")
    }
  }

  const calculateScore = () => {
    const blackScore = captured.black
    const whiteScore = captured.white + 6.5
    return { black: blackScore, white: whiteScore }
  }

  const handleCheckResults = () => {
    setShowResults(true)
    const scores = calculateScore()
    const finalScore = Math.round(
      ((scores.black > scores.white ? scores.black : scores.white) / (BOARD_SIZE * BOARD_SIZE)) * 100,
    )
    onGameEnd(finalScore)
  }

  const scores = calculateScore()
  const timeElapsed = Math.floor((Date.now() - startTime) / 1000)

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div className="text-lg font-semibold">Current: {currentPlayer === "black" ? "⚫ Black" : "⚪ White"}</div>
        <div className="flex gap-4 text-sm">
          <div>⚫ Captured: {captured.black}</div>
          <div>⚪ Captured: {captured.white}</div>
        </div>
      </div>

      <div className="relative">
        <div
          className="grid gap-0 bg-amber-100 p-4 rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 40px)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 40px)`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleMove(rowIndex, colIndex)}
                className="relative border border-gray-800 hover:bg-amber-200 transition-colors"
                disabled={gameOver}
              >
                {cell && (
                  <div
                    className={`absolute inset-1 rounded-full ${
                      cell === "black" ? "bg-black" : "bg-white border-2 border-gray-300"
                    }`}
                  />
                )}
              </button>
            )),
          )}
        </div>

        {showResults && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <Card className="p-6 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold mb-4 text-center">Game Over</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>⚫ Black Score:</span>
                  <span className="font-bold">{scores.black}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>⚪ White Score:</span>
                  <span className="font-bold">{scores.white.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-lg border-t pt-2">
                  <span>Winner:</span>
                  <span className="font-bold">{scores.black > scores.white ? "⚫ Black" : "⚪ White"}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Time:</span>
                  <span>
                    {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => window.location.reload()} className="flex-1">
                    New Game
                  </Button>
                  <Button onClick={() => (window.location.href = "/")} variant="outline" className="flex-1">
                    Home
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handlePass} variant="outline" disabled={gameOver}>
          Pass
        </Button>
        <Button onClick={handleCheckResults} disabled={gameOver}>
          End Game
        </Button>
      </div>
    </div>
  )
}
