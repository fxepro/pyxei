"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  createInitialBoard,
  getValidMoves,
  makeMove,
  checkWinner,
  getAIMove,
  getAllValidMoves,
  type CheckersBoard,
  type Move,
  type Player,
} from "./logic"

interface CheckersGameProps {
  onGameEnd: (winner: string) => void
  gameMode?: "pvp" | "ai-easy" | "ai-medium"
}

export default function CheckersGame({ onGameEnd, gameMode = "pvp" }: CheckersGameProps) {
  const [board, setBoard] = useState<CheckersBoard>(createInitialBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>("red")
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null)
  const [validMoves, setValidMoves] = useState<Move[]>([])
  const [winner, setWinner] = useState<Player | null>(null)
  const [redCaptures, setRedCaptures] = useState(0)
  const [blackCaptures, setBlackCaptures] = useState(0)

  useEffect(() => {
    const gameWinner = checkWinner(board)
    if (gameWinner) {
      setWinner(gameWinner)
      onGameEnd(gameWinner)
    }
  }, [board, onGameEnd])

  useEffect(() => {
    if (winner || currentPlayer === "red") return
    if (gameMode === "pvp") return

    const difficulty = gameMode === "ai-easy" ? "easy" : "medium"
    const timer = setTimeout(() => {
      const aiMove = getAIMove(board, "black", difficulty)
      if (aiMove) {
        const newBoard = makeMove(board, aiMove)
        setBoard(newBoard)
        if (aiMove.captures) {
          setRedCaptures((prev) => prev + aiMove.captures!.length)
        }
        setCurrentPlayer("red")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [currentPlayer, board, winner, gameMode])

  const handleSquareClick = (row: number, col: number) => {
    if (winner) return
    if (gameMode !== "pvp" && currentPlayer === "black") return

    const piece = board[row][col]

    if (selectedSquare) {
      const move = validMoves.find((m) => m.to.row === row && m.to.col === col)

      if (move) {
        const newBoard = makeMove(board, move)
        setBoard(newBoard)
        if (move.captures) {
          if (currentPlayer === "red") {
            setBlackCaptures((prev) => prev + move.captures!.length)
          } else {
            setRedCaptures((prev) => prev + move.captures!.length)
          }
        }
        setCurrentPlayer(currentPlayer === "red" ? "black" : "red")
        setSelectedSquare(null)
        setValidMoves([])
      } else {
        setSelectedSquare(null)
        setValidMoves([])
      }
    } else {
      if (
        (currentPlayer === "red" && (piece === "red" || piece === "red-king")) ||
        (currentPlayer === "black" && (piece === "black" || piece === "black-king"))
      ) {
        setSelectedSquare({ row, col })
        const moves = getValidMoves(board, row, col, currentPlayer)
        const allMoves = getAllValidMoves(board, currentPlayer)
        const hasCaptures = allMoves.some((m) => m.captures && m.captures.length > 0)

        if (hasCaptures) {
          setValidMoves(moves.filter((m) => m.captures && m.captures.length > 0))
        } else {
          setValidMoves(moves)
        }
      }
    }
  }

  const isValidMoveSquare = (row: number, col: number) => {
    return validMoves.some((m) => m.to.row === row && m.to.col === col)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex gap-8 items-start">
        <Card className="p-4">
          <div className="text-sm space-y-3">
            <div>
              <div className="font-semibold mb-1">Current Turn</div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${currentPlayer === "red" ? "bg-red-500" : "bg-gray-800"}`} />
                <span className="capitalize">{currentPlayer}</span>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Captures</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Red:</span>
                  <span>{blackCaptures}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Black:</span>
                  <span>{redCaptures}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="relative">
          <div className="grid grid-cols-8 gap-0 border-4 border-gray-700 rounded">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0
                const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
                const isValidMove = isValidMoveSquare(rowIndex, colIndex)

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    className={`w-12 h-12 flex items-center justify-center relative ${
                      isLight ? "bg-amber-100" : "bg-amber-800"
                    } ${isSelected ? "ring-4 ring-blue-500" : ""} ${isValidMove ? "ring-4 ring-green-500" : ""}`}
                  >
                    {cell !== "empty" && (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          cell === "red" || cell === "red-king"
                            ? "bg-red-500 border-2 border-red-700"
                            : "bg-gray-800 border-2 border-gray-950"
                        }`}
                      >
                        {(cell === "red-king" || cell === "black-king") && (
                          <span className="text-yellow-400 text-xl font-bold">♔</span>
                        )}
                      </div>
                    )}
                  </button>
                )
              }),
            )}
          </div>

          {winner && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-2">Game Over!</div>
                <div className="text-lg capitalize">{winner} wins!</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground text-center max-w-md">
        <div>Click a piece to select it, then click a highlighted square to move</div>
        <div>Captures are mandatory when available</div>
      </div>
    </div>
  )
}
