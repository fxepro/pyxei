"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generatePuzzle, checkCell, checkPuzzleComplete, calculateScore, type CrosswordPuzzle } from "./logic"

interface CrosswordGameProps {
  onGameEnd: (score: number) => void
  difficulty?: string
}

export default function CrosswordGame({ onGameEnd, difficulty = "easy" }: CrosswordGameProps) {
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle>(generatePuzzle(difficulty))
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [startTime] = useState(Date.now())
  const [gameComplete, setGameComplete] = useState(false)

  useEffect(() => {
    if (checkPuzzleComplete(puzzle.grid) && !gameComplete) {
      setGameComplete(true)
      const timeInSeconds = Math.floor((Date.now() - startTime) / 1000)
      const score = calculateScore(puzzle.grid, timeInSeconds)
      onGameEnd(score)
    }
  }, [puzzle.grid, gameComplete, startTime, onGameEnd])

  const handleCellInput = (row: number, col: number, value: string) => {
    if (value.length > 1) return

    const newGrid = puzzle.grid.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          return { ...cell, userInput: value.toUpperCase() }
        }
        return cell
      }),
    )

    setPuzzle({ ...puzzle, grid: newGrid })
  }

  const handleReset = () => {
    setPuzzle(generatePuzzle(difficulty))
    setSelectedCell(null)
    setGameComplete(false)
  }

  const acrossClues = puzzle.clues.filter((c) => c.direction === "across")
  const downClues = puzzle.clues.filter((c) => c.direction === "down")

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4">
      <div className="flex-1">
        <div className="grid gap-0.5 bg-muted p-4 rounded-lg inline-block">
          {puzzle.grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-0.5">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-10 h-10 relative
                    ${cell.isBlack ? "bg-foreground" : "bg-background"}
                  `}
                >
                  {!cell.isBlack && (
                    <>
                      {cell.number && (
                        <span className="absolute top-0 left-0.5 text-[8px] font-bold">{cell.number}</span>
                      )}
                      <Input
                        value={cell.userInput}
                        onChange={(e) => handleCellInput(rowIndex, colIndex, e.target.value)}
                        maxLength={1}
                        className={`
                          w-full h-full text-center uppercase font-bold border-0 p-0
                          ${checkCell(cell, cell.userInput) && cell.userInput ? "bg-green-100 dark:bg-green-900" : ""}
                          ${cell.userInput && !checkCell(cell, cell.userInput) ? "bg-red-100 dark:bg-red-900" : ""}
                        `}
                        disabled={gameComplete}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-2">Across</h3>
          <div className="space-y-2">
            {acrossClues.map((clue) => (
              <div key={`across-${clue.number}`} className="text-sm">
                <span className="font-semibold">{clue.number}.</span> {clue.clue}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">Down</h3>
          <div className="space-y-2">
            {downClues.map((clue) => (
              <div key={`down-${clue.number}`} className="text-sm">
                <span className="font-semibold">{clue.number}.</span> {clue.clue}
              </div>
            ))}
          </div>
        </div>

        {gameComplete && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="text-xl font-bold text-center">Puzzle Complete!</div>
            <Button onClick={handleReset} className="w-full">
              New Puzzle
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
