"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface Cell {
  letter: string
  number?: number
  isBlack: boolean
  userInput: string
}

interface Clue {
  number: number
  clue: string
  answer: string
  direction: "across" | "down"
  startRow: number
  startCol: number
}

interface CrosswordPuzzle {
  grid: Cell[][]
  clues: Clue[]
  size: number
}

const EASY_PUZZLES: CrosswordPuzzle[] = [
  {
    size: 7,
    grid: [],
    clues: [
      { number: 1, clue: "Feline pet", answer: "CAT", direction: "across", startRow: 0, startCol: 0 },
      { number: 2, clue: "Canine pet", answer: "DOG", direction: "across", startRow: 2, startCol: 0 },
      { number: 3, clue: "Flying mammal", answer: "BAT", direction: "down", startRow: 0, startCol: 0 },
      { number: 4, clue: "Large body of water", answer: "SEA", direction: "across", startRow: 4, startCol: 0 },
      { number: 5, clue: "Opposite of hot", answer: "COLD", direction: "down", startRow: 2, startCol: 2 },
    ],
  },
]

function generatePuzzle(difficulty = "easy"): CrosswordPuzzle {
  const puzzle = EASY_PUZZLES[0]
  const grid: Cell[][] = []

  for (let i = 0; i < puzzle.size; i++) {
    grid[i] = []
    for (let j = 0; j < puzzle.size; j++) {
      grid[i][j] = {
        letter: "",
        isBlack: true,
        userInput: "",
      }
    }
  }

  puzzle.clues.forEach((clue) => {
    const { answer, direction, startRow, startCol, number } = clue

    for (let i = 0; i < answer.length; i++) {
      const row = direction === "across" ? startRow : startRow + i
      const col = direction === "across" ? startCol + i : startCol

      if (row < puzzle.size && col < puzzle.size) {
        // Only set number on the first cell, and keep the lowest number if multiple clues start here
        const existingNumber = grid[row][col].number
        grid[row][col] = {
          letter: answer[i],
          number: i === 0 ? (existingNumber ? Math.min(existingNumber, number) : number) : grid[row][col].number,
          isBlack: false,
          userInput: "",
        }
      }
    }
  })

  return {
    ...puzzle,
    grid,
  }
}

function checkCell(cell: Cell, input: string): boolean {
  return cell.letter.toUpperCase() === input.toUpperCase()
}

function checkPuzzleComplete(grid: Cell[][]): boolean {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const cell = grid[i][j]
      if (!cell.isBlack && cell.userInput.toUpperCase() !== cell.letter.toUpperCase()) {
        return false
      }
    }
  }
  return true
}

function calculateScore(grid: Cell[][], timeInSeconds: number): number {
  let correct = 0
  let total = 0

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const cell = grid[i][j]
      if (!cell.isBlack) {
        total++
        if (cell.userInput.toUpperCase() === cell.letter.toUpperCase()) {
          correct++
        }
      }
    }
  }

  const accuracy = (correct / total) * 100
  const timeBonus = Math.max(0, 1000 - timeInSeconds * 2)

  return Math.round(accuracy * 10 + timeBonus)
}

interface CrosswordGameProps {
  onGameEnd: (score: number) => void
  difficulty?: string
}

export function CrosswordGame({ onGameEnd, difficulty = "easy" }: CrosswordGameProps) {
  const router = useRouter()
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle>(generatePuzzle(difficulty))
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [startTime] = useState(Date.now())
  const [gameComplete, setGameComplete] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const handleSubmit = () => {
    const timeInSeconds = Math.floor((Date.now() - startTime) / 1000)
    const score = calculateScore(puzzle.grid, timeInSeconds)
    setFinalScore(score)
    setTimeElapsed(timeInSeconds)
    setShowResults(true)
    setGameComplete(true)
    onGameEnd(score)
  }

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
    setShowResults(false)
    setShowSolution(false)
  }

  const toggleSolution = () => {
    setShowSolution(!showSolution)
  }

  const getCompletionPercentage = () => {
    let filled = 0
    let total = 0
    puzzle.grid.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.isBlack) {
          total++
          if (cell.userInput) filled++
        }
      })
    })
    return total > 0 ? Math.round((filled / total) * 100) : 0
  }

  const getCorrectCount = () => {
    let correct = 0
    let total = 0
    puzzle.grid.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.isBlack) {
          total++
          if (cell.userInput.toUpperCase() === cell.letter.toUpperCase()) {
            correct++
          }
        }
      })
    })
    return { correct, total }
  }

  const acrossClues = puzzle.clues.filter((c) => c.direction === "across")
  const downClues = puzzle.clues.filter((c) => c.direction === "down")

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 relative">
      <div className="flex-1">
        <div className="grid gap-0.5 bg-muted p-4 rounded-lg inline-block">
          {puzzle.grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-0.5">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-10 h-10 relative
                    ${cell.isBlack ? "bg-black" : "bg-background"}
                  `}
                >
                  {!cell.isBlack && (
                    <>
                      {cell.number && (
                        <span className="absolute top-0 left-0.5 text-[8px] font-bold">{cell.number}</span>
                      )}
                      <Input
                        value={showSolution ? cell.letter : cell.userInput}
                        onChange={(e) => handleCellInput(rowIndex, colIndex, e.target.value)}
                        maxLength={1}
                        className={`
                          w-full h-full text-center uppercase font-bold border-0 p-0
                          ${checkCell(cell, cell.userInput) && cell.userInput ? "bg-green-100 dark:bg-green-900" : ""}
                          ${cell.userInput && !checkCell(cell, cell.userInput) ? "bg-red-100 dark:bg-red-900" : ""}
                          ${showSolution ? "bg-blue-100 dark:bg-blue-900" : ""}
                        `}
                        disabled={gameComplete || showSolution}
                        readOnly={showSolution}
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

        {!gameComplete && (
          <Button onClick={handleSubmit} className="w-full" size="lg">
            Check Answers
          </Button>
        )}
      </div>

      {showResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-lg shadow-lg max-w-md w-full p-6 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Puzzle Complete!</h2>
              <div className="text-4xl font-bold text-primary">{finalScore}</div>
              <p className="text-muted-foreground">Final Score</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Completion</span>
                <span className="text-lg font-bold">{getCompletionPercentage()}%</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Correct Answers</span>
                <span className="text-lg font-bold">
                  {getCorrectCount().correct}/{getCorrectCount().total}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Time</span>
                <span className="text-lg font-bold">
                  {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={toggleSolution} variant="outline" className="w-full bg-transparent">
                {showSolution ? "Hide Solution" : "Show Solution"}
              </Button>
              <Button onClick={handleReset} className="w-full">
                New Puzzle
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Back to Games
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
