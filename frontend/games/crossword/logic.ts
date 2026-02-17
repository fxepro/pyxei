export interface Cell {
  letter: string
  number?: number
  isBlack: boolean
  userInput: string
}

export interface Clue {
  number: number
  clue: string
  answer: string
  direction: "across" | "down"
  startRow: number
  startCol: number
}

export interface CrosswordPuzzle {
  grid: Cell[][]
  clues: Clue[]
  size: number
}

// Simple crossword puzzles
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

export function generatePuzzle(difficulty = "easy"): CrosswordPuzzle {
  const puzzle = EASY_PUZZLES[0]
  const grid: Cell[][] = []

  // Initialize empty grid
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

  // Place words
  puzzle.clues.forEach((clue) => {
    const { answer, direction, startRow, startCol, number } = clue

    for (let i = 0; i < answer.length; i++) {
      const row = direction === "across" ? startRow : startRow + i
      const col = direction === "across" ? startCol + i : startCol

      if (row < puzzle.size && col < puzzle.size) {
        grid[row][col] = {
          letter: answer[i],
          number: i === 0 ? number : grid[row][col].number,
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

export function checkCell(cell: Cell, input: string): boolean {
  return cell.letter.toUpperCase() === input.toUpperCase()
}

export function checkPuzzleComplete(grid: Cell[][]): boolean {
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

export function calculateScore(grid: Cell[][], timeInSeconds: number): number {
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
