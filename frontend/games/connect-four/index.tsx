"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  createEmptyBoard,
  dropDisc,
  checkWinner,
  isBoardFull,
  isColumnFull,
  getAIMove,
  type Player,
  type Board,
  type GameMode,
} from "./logic"

interface ConnectFourGameProps {
  onGameEnd: (score: number) => void
  gameMode?: GameMode
}

export default function ConnectFourGame({ onGameEnd, gameMode = "pvp" }: ConnectFourGameProps) {
  const [board, setBoard] = useState<Board>(createEmptyBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>("red")
  const [winner, setWinner] = useState<Player>(null)
  const [gameOver, setGameOver] = useState(false)
  const [winningCells, setWinningCells] = useState<number[][]>([])
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [isAIThinking, setIsAIThinking] = useState(false)

  const handleColumnClick = (col: number) => {
    if (gameOver || isColumnFull(board, col) || isAIThinking) return
    if (gameMode !== "pvp" && currentPlayer === "yellow") return // Prevent player from moving during AI turn

    const newBoard = dropDisc(board, col, currentPlayer)
    if (!newBoard) return

    setBoard(newBoard)

    const result = checkWinner(newBoard)
    if (result.winner) {
      setWinner(result.winner)
      setWinningCells(result.cells)
      setGameOver(true)
      const score = result.winner === "red" ? 100 : 0
      setTimeout(() => onGameEnd(score), 1500)
      return
    }

    if (isBoardFull(newBoard)) {
      setGameOver(true)
      setTimeout(() => onGameEnd(50), 1500) // Draw
      return
    }

    setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red")
  }

  // AI move logic
  useEffect(() => {
    if (gameOver || gameMode === "pvp" || currentPlayer !== "yellow") return

    setIsAIThinking(true)
    const timer = setTimeout(() => {
      const difficulty = gameMode === "ai-easy" ? "easy" : "medium"
      const aiCol = getAIMove(board, difficulty)

      const newBoard = dropDisc(board, aiCol, "yellow")
      if (!newBoard) {
        setIsAIThinking(false)
        return
      }

      setBoard(newBoard)

      const result = checkWinner(newBoard)
      if (result.winner) {
        setWinner(result.winner)
        setWinningCells(result.cells)
        setGameOver(true)
        setTimeout(() => onGameEnd(0), 1500)
        setIsAIThinking(false)
        return
      }

      if (isBoardFull(newBoard)) {
        setGameOver(true)
        setTimeout(() => onGameEnd(50), 1500)
        setIsAIThinking(false)
        return
      }

      setCurrentPlayer("red")
      setIsAIThinking(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [currentPlayer, gameMode, board, gameOver, onGameEnd])

  const resetGame = () => {
    setBoard(createEmptyBoard())
    setCurrentPlayer("red")
    setWinner(null)
    setGameOver(false)
    setWinningCells([])
    setIsAIThinking(false)
  }

  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col)
  }

  const getDiscColor = (player: Player) => {
    if (player === "red") return "bg-red-500"
    if (player === "yellow") return "bg-yellow-400"
    return "bg-gray-200"
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-700">
        <div className="flex flex-col gap-2">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((cell, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => handleColumnClick(colIndex)}
                  onMouseEnter={() => setHoveredCol(colIndex)}
                  onMouseLeave={() => setHoveredCol(null)}
                  disabled={gameOver || isAIThinking}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all ${
                    hoveredCol === colIndex && !gameOver && !isAIThinking
                      ? "ring-2 ring-white ring-offset-2 ring-offset-blue-600"
                      : ""
                  } ${isWinningCell(rowIndex, colIndex) ? "ring-4 ring-green-400 animate-pulse" : ""}`}
                >
                  <div
                    className={`w-full h-full rounded-full ${getDiscColor(cell)} ${
                      cell ? "shadow-lg" : "bg-white/20"
                    } transition-all`}
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center space-y-4">
        {!gameOver && !isAIThinking && (
          <div className="flex items-center gap-3 justify-center">
            <div className={`w-6 h-6 rounded-full ${getDiscColor(currentPlayer)}`} />
            <p className="text-lg font-semibold">
              {currentPlayer === "red" ? "Your" : gameMode === "pvp" ? "Yellow's" : "AI's"} Turn
            </p>
          </div>
        )}

        {isAIThinking && <p className="text-lg font-semibold text-muted-foreground">AI is thinking...</p>}

        {gameOver && (
          <div className="space-y-3">
            {winner ? (
              <p className="text-2xl font-bold text-green-600">
                {winner === "red" ? "You Win!" : gameMode === "pvp" ? "Yellow Wins!" : "AI Wins!"}
              </p>
            ) : (
              <p className="text-2xl font-bold text-yellow-600">It's a Draw!</p>
            )}
            <Button onClick={resetGame} size="lg">
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
