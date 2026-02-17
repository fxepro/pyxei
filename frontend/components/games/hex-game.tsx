"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HexGameProps {
  onGameEnd: (score: number) => void
  difficulty?: string
}

type Cell = {
  row: number
  col: number
  owner: "red" | "blue" | null
}

type GameState = "playing" | "finished"

export function HexGame({ onGameEnd, difficulty = "medium" }: HexGameProps) {
  const boardSize = difficulty === "easy" ? 7 : difficulty === "hard" ? 13 : 11
  const [board, setBoard] = useState<Cell[][]>([])
  const [currentPlayer, setCurrentPlayer] = useState<"red" | "blue">("red")
  const [gameState, setGameState] = useState<GameState>("playing")
  const [winner, setWinner] = useState<"red" | "blue" | null>(null)
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)
  const [moveCount, setMoveCount] = useState(0)
  const [startTime] = useState(Date.now())
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const newBoard: Cell[][] = []
    for (let row = 0; row < boardSize; row++) {
      newBoard[row] = []
      for (let col = 0; col < boardSize; col++) {
        newBoard[row][col] = { row, col, owner: null }
      }
    }
    setBoard(newBoard)
  }, [boardSize])

  const checkRedWin = (board: Cell[][]): boolean => {
    const visited = new Set<string>()
    const queue: Cell[] = []

    // Start from left edge (red's starting side)
    for (let row = 0; row < boardSize; row++) {
      if (board[row][0].owner === "red") {
        queue.push(board[row][0])
        visited.add(`${row},0`)
      }
    }

    while (queue.length > 0) {
      const cell = queue.shift()!

      // Check if reached right edge
      if (cell.col === boardSize - 1) {
        return true
      }

      // Check all 6 neighbors in hex grid
      const neighbors = getNeighbors(cell.row, cell.col, board)
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`
        if (!visited.has(key) && neighbor.owner === "red") {
          visited.add(key)
          queue.push(neighbor)
        }
      }
    }

    return false
  }

  const checkBlueWin = (board: Cell[][]): boolean => {
    const visited = new Set<string>()
    const queue: Cell[] = []

    // Start from top edge (blue's starting side)
    for (let col = 0; col < boardSize; col++) {
      if (board[0][col].owner === "blue") {
        queue.push(board[0][col])
        visited.add(`0,${col}`)
      }
    }

    while (queue.length > 0) {
      const cell = queue.shift()!

      // Check if reached bottom edge
      if (cell.row === boardSize - 1) {
        return true
      }

      // Check all 6 neighbors
      const neighbors = getNeighbors(cell.row, cell.col, board)
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`
        if (!visited.has(key) && neighbor.owner === "blue") {
          visited.add(key)
          queue.push(neighbor)
        }
      }
    }

    return false
  }

  const getNeighbors = (row: number, col: number, board: Cell[][]): Cell[] => {
    const neighbors: Cell[] = []
    const directions = [
      [-1, 0],
      [-1, 1], // top-left, top-right
      [0, -1],
      [0, 1], // left, right
      [1, -1],
      [1, 0], // bottom-left, bottom-right
    ]

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        neighbors.push(board[newRow][newCol])
      }
    }

    return neighbors
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== "playing" || board[row][col].owner !== null) return

    const newBoard = board.map((r) => r.map((c) => ({ ...c })))
    newBoard[row][col].owner = currentPlayer
    setBoard(newBoard)
    setMoveCount(moveCount + 1)

    // Check for win
    if (currentPlayer === "red" && checkRedWin(newBoard)) {
      setWinner("red")
      setGameState("finished")
      setShowResults(true)
      const timeTaken = Math.floor((Date.now() - startTime) / 1000)
      const score = Math.max(100 - moveCount * 2 - timeTaken, 10)
      setTimeout(() => onGameEnd(score), 2000)
    } else if (currentPlayer === "blue" && checkBlueWin(newBoard)) {
      setWinner("blue")
      setGameState("finished")
      setShowResults(true)
      const timeTaken = Math.floor((Date.now() - startTime) / 1000)
      const score = Math.max(100 - moveCount * 2 - timeTaken, 10)
      setTimeout(() => onGameEnd(score), 2000)
    } else {
      setCurrentPlayer(currentPlayer === "red" ? "blue" : "red")
    }
  }

  const makeAIMove = () => {
    if (gameState !== "playing" || currentPlayer !== "blue") return

    // Find empty cells
    const emptyCells: { row: number; col: number }[] = []
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (board[row][col].owner === null) {
          emptyCells.push({ row, col })
        }
      }
    }

    if (emptyCells.length > 0) {
      // Pick random empty cell
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      setTimeout(() => handleCellClick(randomCell.row, randomCell.col), 500)
    }
  }

  useEffect(() => {
    if (currentPlayer === "blue" && gameState === "playing") {
      makeAIMove()
    }
  }, [currentPlayer, gameState])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const timeTaken = Math.floor((Date.now() - startTime) / 1000)

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${currentPlayer === "red" ? "bg-red-500" : "bg-red-300"}`} />
          <span className="font-semibold">Red (You)</span>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Moves: {moveCount}</div>
          <div className="text-sm text-muted-foreground">Time: {formatTime(timeTaken)}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Blue (AI)</span>
          <div className={`w-4 h-4 rounded-full ${currentPlayer === "blue" ? "bg-blue-500" : "bg-blue-300"}`} />
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
        <div className="flex flex-col items-center gap-1" style={{ transform: "rotate(-30deg)" }}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1" style={{ marginLeft: `${rowIndex * 20}px` }}>
              {row.map((cell, colIndex) => {
                const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => setHoveredCell(null)}
                    disabled={gameState !== "playing" || cell.owner !== null || currentPlayer === "blue"}
                    className={`
                      w-10 h-10 rounded-sm border-2 transition-all
                      ${cell.owner === "red" ? "bg-red-500 border-red-600" : ""}
                      ${cell.owner === "blue" ? "bg-blue-500 border-blue-600" : ""}
                      ${cell.owner === null ? "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" : ""}
                      ${isHovered && cell.owner === null && currentPlayer === "red" ? "bg-red-200 dark:bg-red-900 scale-110" : ""}
                      ${gameState === "playing" && cell.owner === null && currentPlayer === "red" ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed"}
                    `}
                    style={{ transform: "rotate(30deg)" }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p className="font-semibold mb-2">How to Play:</p>
        <p>Red connects left to right. Blue connects top to bottom. First to connect their sides wins!</p>
      </div>

      {showResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-8 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">{winner === "red" ? "🎉" : "🤖"}</div>
              <h2 className="text-3xl font-bold">{winner === "red" ? "You Won!" : "AI Won!"}</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Moves: {moveCount}</p>
                <p>Time: {formatTime(timeTaken)}</p>
              </div>
              <div className="flex gap-2 pt-4">
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
  )
}
