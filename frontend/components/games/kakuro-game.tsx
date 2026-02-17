"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface KakuroGameProps {
  onGameEnd: (score: number) => void
  difficulty?: string
}

interface Cell {
  row: number
  col: number
  value: number
  userValue: string
  isClue: boolean
  clueDown?: number
  clueAcross?: number
  isBlack?: boolean
}

export function KakuroGame({ onGameEnd, difficulty = "medium" }: KakuroGameProps) {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [startTime] = useState(Date.now())
  const [showResults, setShowResults] = useState(false)
  const [mistakes, setMistakes] = useState(0)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // Create a simple 7x7 Kakuro puzzle
    const newGrid: Cell[][] = Array(7)
      .fill(null)
      .map((_, row) =>
        Array(7)
          .fill(null)
          .map((_, col) => ({
            row,
            col,
            value: 0,
            userValue: "",
            isClue: false,
            isBlack: false,
          })),
      )

    // Set up black cells and clues
    // Top-left corner and some strategic black cells
    newGrid[0][0].isBlack = true
    newGrid[0][1].isClue = true
    newGrid[0][1].clueDown = 16
    newGrid[0][2].isClue = true
    newGrid[0][2].clueDown = 17
    newGrid[0][3].isClue = true
    newGrid[0][3].clueDown = 6
    newGrid[0][4].isClue = true
    newGrid[0][4].clueDown = 23
    newGrid[0][5].isClue = true
    newGrid[0][5].clueDown = 7
    newGrid[0][6].isClue = true
    newGrid[0][6].clueDown = 8

    newGrid[1][0].isClue = true
    newGrid[1][0].clueAcross = 23
    newGrid[2][0].isClue = true
    newGrid[2][0].clueAcross = 30
    newGrid[3][0].isClue = true
    newGrid[3][0].clueAcross = 27
    newGrid[4][0].isClue = true
    newGrid[4][0].clueAcross = 12
    newGrid[5][0].isClue = true
    newGrid[5][0].clueAcross = 16
    newGrid[6][0].isClue = true
    newGrid[6][0].clueAcross = 17

    // Set solution values (hidden from user)
    // Row 1: 23 = 9+8+6
    newGrid[1][1].value = 9
    newGrid[1][2].value = 8
    newGrid[1][3].value = 6
    newGrid[1][4].value = 7
    newGrid[1][5].value = 1
    newGrid[1][6].value = 2

    // Row 2: 30 = 9+8+7+6
    newGrid[2][1].value = 7
    newGrid[2][2].value = 9
    newGrid[2][3].value = 5
    newGrid[2][4].value = 8
    newGrid[2][5].value = 6
    newGrid[2][6].value = 4

    // Row 3: 27 = 9+8+6+4
    newGrid[3][1].value = 8
    newGrid[3][2].value = 7
    newGrid[3][3].value = 1
    newGrid[3][4].value = 9
    newGrid[3][5].value = 2
    newGrid[3][6].value = 3

    // Row 4: 12 = 9+3
    newGrid[4][1].value = 6
    newGrid[4][2].value = 1
    newGrid[4][3].value = 2
    newGrid[4][4].value = 3
    newGrid[4][5].value = 4
    newGrid[4][6].value = 5

    // Row 5: 16 = 9+7
    newGrid[5][1].value = 5
    newGrid[5][2].value = 2
    newGrid[5][3].value = 3
    newGrid[5][4].value = 1
    newGrid[5][5].value = 8
    newGrid[5][6].value = 9

    // Row 6: 17 = 8+9
    newGrid[6][1].value = 4
    newGrid[6][2].value = 3
    newGrid[6][3].value = 9
    newGrid[6][4].value = 2
    newGrid[6][5].value = 7
    newGrid[6][6].value = 6

    setGrid(newGrid)
  }

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isClue || grid[row][col].isBlack) return
    setSelectedCell({ row, col })
  }

  const handleInputChange = (value: string) => {
    if (!selectedCell) return
    if (value && (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 9)) return

    const newGrid = [...grid]
    newGrid[selectedCell.row][selectedCell.col].userValue = value

    // Check if incorrect
    if (value && Number(value) !== newGrid[selectedCell.row][selectedCell.col].value) {
      setMistakes((prev) => prev + 1)
    }

    setGrid(newGrid)

    // Check if puzzle is complete
    if (isPuzzleComplete(newGrid)) {
      setTimeout(() => {
        setShowResults(true)
      }, 500)
    }
  }

  const isPuzzleComplete = (currentGrid: Cell[][]) => {
    for (let row = 0; row < currentGrid.length; row++) {
      for (let col = 0; col < currentGrid[row].length; col++) {
        const cell = currentGrid[row][col]
        if (!cell.isClue && !cell.isBlack && cell.userValue === "") {
          return false
        }
        if (cell.userValue && Number(cell.userValue) !== cell.value) {
          return false
        }
      }
    }
    return true
  }

  const handleCheckAnswers = () => {
    setShowResults(true)
  }

  const handleShowSolution = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        userValue: cell.value > 0 ? cell.value.toString() : "",
      })),
    )
    setGrid(newGrid)
  }

  const handleNewPuzzle = () => {
    setShowResults(false)
    setMistakes(0)
    initializeGame()
    setSelectedCell(null)
  }

  const calculateScore = () => {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const baseScore = 1000
    const timePenalty = Math.floor(timeElapsed / 10) * 5
    const mistakePenalty = mistakes * 50
    return Math.max(0, baseScore - timePenalty - mistakePenalty)
  }

  const getCompletionPercentage = () => {
    let filled = 0
    let total = 0
    grid.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.isClue && !cell.isBlack) {
          total++
          if (cell.userValue !== "") filled++
        }
      })
    })
    return total > 0 ? Math.round((filled / total) * 100) : 0
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div className="text-sm">
          <span className="font-semibold">Mistakes:</span> {mistakes}
        </div>
        <div className="text-sm">
          <span className="font-semibold">Progress:</span> {getCompletionPercentage()}%
        </div>
      </div>

      <div className="grid gap-0 border-2 border-foreground">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  w-12 h-12 border border-border flex items-center justify-center relative
                  ${cell.isBlack ? "bg-black" : "bg-background"}
                  ${cell.isClue ? "bg-black" : ""}
                  ${
                    !cell.isClue && !cell.isBlack && selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? "ring-2 ring-primary"
                      : ""
                  }
                  ${!cell.isClue && !cell.isBlack ? "cursor-pointer hover:bg-muted" : ""}
                `}
              >
                {cell.isClue && (
                  <>
                    {cell.clueDown && (
                      <span className="absolute top-0.5 right-0.5 text-[10px] text-white font-bold">
                        {cell.clueDown}
                      </span>
                    )}
                    {cell.clueAcross && (
                      <span className="absolute bottom-0.5 left-0.5 text-[10px] text-white font-bold">
                        {cell.clueAcross}
                      </span>
                    )}
                    <div className="absolute inset-0 border-t border-l border-white transform rotate-45 origin-bottom-left" />
                  </>
                )}
                {!cell.isClue && !cell.isBlack && (
                  <span
                    className={`text-lg font-semibold ${
                      cell.userValue && Number(cell.userValue) !== cell.value
                        ? "text-red-500"
                        : cell.userValue && Number(cell.userValue) === cell.value
                          ? "text-green-500"
                          : ""
                    }`}
                  >
                    {cell.userValue}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedCell && (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button key={num} variant="outline" size="sm" onClick={() => handleInputChange(num.toString())}>
              {num}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => handleInputChange("")}>
            Clear
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleCheckAnswers}>Check Answers</Button>
        <Button variant="outline" onClick={handleNewPuzzle}>
          New Puzzle
        </Button>
      </div>

      {showResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-3xl font-bold">Puzzle Complete!</h2>

              <div className="w-full space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Final Score:</span>
                  <span className="text-2xl font-bold">{calculateScore()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completion:</span>
                  <span className="text-xl font-semibold">{getCompletionPercentage()}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Mistakes:</span>
                  <span className="text-xl font-semibold">{mistakes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="text-xl font-semibold">{Math.floor((Date.now() - startTime) / 1000)}s</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Button onClick={handleShowSolution} variant="outline" className="w-full bg-transparent">
                  Show Solution
                </Button>
                <Button onClick={handleNewPuzzle} className="w-full">
                  New Puzzle
                </Button>
                <Button
                  onClick={() => {
                    onGameEnd(calculateScore())
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  Back to Games
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
