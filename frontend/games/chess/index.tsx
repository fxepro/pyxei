"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Chess, type Square } from "chess.js"
import {
  createNewGame,
  getBoardArray,
  getSquareFromCoords,
  getLegalMoves,
  makeMove,
  isGameOver,
  getGameResult,
  calculateScore,
  isInCheck,
  getCurrentPlayer,
} from "./logic"

interface ChessGameProps {
  onGameEnd: (score: number) => void
  gameMode?: string
}

type GameMode = "pvp" | "ai-easy" | "ai-medium"

const makeAIMove = (chess: Chess, difficulty: "easy" | "medium"): boolean => {
  const moves = chess.moves({ verbose: true })
  if (moves.length === 0) return false

  let selectedMove

  if (difficulty === "easy") {
    // Random move
    selectedMove = moves[Math.floor(Math.random() * moves.length)]
  } else {
    // Medium: Prioritize captures, avoid hanging pieces
    const captureMoves = moves.filter((m) => m.captured)
    if (captureMoves.length > 0) {
      selectedMove = captureMoves[Math.floor(Math.random() * captureMoves.length)]
    } else {
      selectedMove = moves[Math.floor(Math.random() * moves.length)]
    }
  }

  chess.move(selectedMove)
  return true
}

export function ChessGame({ onGameEnd, gameMode: initialGameMode = "pvp" }: ChessGameProps) {
  const gameMode = (initialGameMode as GameMode) || "pvp"
  const [chess, setChess] = useState<Chess>(createNewGame())
  const [board, setBoard] = useState<(string | null)[][]>([])
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [legalMoves, setLegalMoves] = useState<Square[]>([])
  const [moveCount, setMoveCount] = useState(0)
  const [gameStatus, setGameStatus] = useState<string>("")
  const [isAIThinking, setIsAIThinking] = useState(false)

  useEffect(() => {
    setBoard(getBoardArray(chess))
    setMoveCount(chess.history().length)

    if (isGameOver(chess)) {
      const result = getGameResult(chess)
      if (result.isCheckmate) {
        setGameStatus(`Checkmate! ${result.winner} wins!`)
      } else if (result.isStalemate) {
        setGameStatus("Stalemate!")
      } else if (result.isDraw) {
        setGameStatus("Draw!")
      }
    } else if (isInCheck(chess)) {
      setGameStatus(`${getCurrentPlayer(chess)} is in check!`)
    } else {
      setGameStatus(`${getCurrentPlayer(chess)}'s turn`)
    }

    if (gameMode && gameMode !== "pvp" && chess.turn() === "b" && !isGameOver(chess) && !isAIThinking) {
      setIsAIThinking(true)
      setTimeout(() => {
        const difficulty = gameMode === "ai-easy" ? "easy" : "medium"
        makeAIMove(chess, difficulty)
        setChess(new Chess(chess.fen()))
        setIsAIThinking(false)

        if (isGameOver(chess)) {
          setTimeout(() => {
            onGameEnd(calculateScore(chess))
          }, 1000)
        }
      }, 500)
    }
  }, [chess, gameMode, isAIThinking, onGameEnd])

  const handleSquareClick = (row: number, col: number) => {
    if (isAIThinking || (gameMode !== "pvp" && chess.turn() === "b")) return

    const clickedSquare = getSquareFromCoords(row, col)

    if (selectedSquare) {
      const moveMade = makeMove(chess, selectedSquare, clickedSquare)

      if (moveMade) {
        setChess(new Chess(chess.fen()))
        setSelectedSquare(null)
        setLegalMoves([])

        if (isGameOver(chess)) {
          setTimeout(() => {
            onGameEnd(calculateScore(chess))
          }, 1000)
        }
      } else {
        const moves = getLegalMoves(chess, clickedSquare)
        if (moves.length > 0) {
          setSelectedSquare(clickedSquare)
          setLegalMoves(moves)
        } else {
          setSelectedSquare(null)
          setLegalMoves([])
        }
      }
    } else {
      const moves = getLegalMoves(chess, clickedSquare)
      if (moves.length > 0) {
        setSelectedSquare(clickedSquare)
        setLegalMoves(moves)
      }
    }
  }

  const handleReset = () => {
    const newGame = createNewGame()
    setChess(newGame)
    setSelectedSquare(null)
    setLegalMoves([])
    setGameStatus("")
    setIsAIThinking(false)
  }

  const isSquareSelected = (row: number, col: number): boolean => {
    if (!selectedSquare) return false
    const square = getSquareFromCoords(row, col)
    return square === selectedSquare
  }

  const isLegalMove = (row: number, col: number): boolean => {
    const square = getSquareFromCoords(row, col)
    return legalMoves.includes(square)
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 w-full max-w-2xl">
          <div className="text-2xl font-bold text-center">{isAIThinking ? "AI is thinking..." : gameStatus}</div>
          <div className="text-lg font-semibold">Moves: {moveCount}</div>
          <div className="text-sm text-muted-foreground">
            {gameMode === "pvp" ? "Player vs Player" : `Playing vs AI (${gameMode === "ai-easy" ? "Easy" : "Medium"})`}
          </div>
        </div>

        <div className="grid grid-cols-8 gap-0 border-4 border-border rounded-lg overflow-hidden shadow-lg">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0
              const isSelected = isSquareSelected(rowIndex, colIndex)
              const isLegal = isLegalMove(rowIndex, colIndex)

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  disabled={isGameOver(chess) || isAIThinking}
                  className={`w-16 h-16 flex items-center justify-center text-4xl transition-all ${
                    isLight ? "bg-amber-100" : "bg-amber-700"
                  } ${isSelected ? "ring-4 ring-blue-500 ring-inset" : ""} ${
                    isLegal ? "ring-4 ring-green-500 ring-inset" : ""
                  } hover:opacity-80 disabled:cursor-not-allowed ${isAIThinking ? "opacity-50" : ""}`}
                >
                  {piece}
                </button>
              )
            }),
          )}
        </div>

        <div className="flex gap-4">
          <Button onClick={handleReset}>New Game</Button>
          <Button variant="outline" onClick={() => onGameEnd(calculateScore(chess))}>
            End Game
          </Button>
        </div>
      </div>
    </Card>
  )
}
