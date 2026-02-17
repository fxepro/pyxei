export type Gem = "💎" | "💚" | "💙" | "💛" | "💜" | "🧡"

export interface Board {
  grid: Gem[][]
  score: number
  moves: number
}

const GEMS: Gem[] = ["💎", "💚", "💙", "💛", "💜", "🧡"]

export function createBoard(rows = 8, cols = 8): Board {
  const grid: Gem[][] = []

  for (let i = 0; i < rows; i++) {
    grid[i] = []
    for (let j = 0; j < cols; j++) {
      grid[i][j] = GEMS[Math.floor(Math.random() * GEMS.length)]
    }
  }

  // Remove initial matches
  removeInitialMatches(grid)

  return {
    grid,
    score: 0,
    moves: 0,
  }
}

function removeInitialMatches(grid: Gem[][]): void {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      while (
        (j >= 2 && grid[i][j] === grid[i][j - 1] && grid[i][j] === grid[i][j - 2]) ||
        (i >= 2 && grid[i][j] === grid[i - 1][j] && grid[i][j] === grid[i - 2][j])
      ) {
        grid[i][j] = GEMS[Math.floor(Math.random() * GEMS.length)]
      }
    }
  }
}

export function canSwap(grid: Gem[][], row1: number, col1: number, row2: number, col2: number): boolean {
  // Check if adjacent
  const rowDiff = Math.abs(row1 - row2)
  const colDiff = Math.abs(col1 - col2)

  if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
    // Simulate swap
    const temp = grid[row1][col1]
    grid[row1][col1] = grid[row2][col2]
    grid[row2][col2] = temp

    const hasMatch = findMatches(grid).length > 0

    // Swap back
    grid[row2][col2] = grid[row1][col1]
    grid[row1][col1] = temp

    return hasMatch
  }

  return false
}

export function swapGems(grid: Gem[][], row1: number, col1: number, row2: number, col2: number): Gem[][] {
  const newGrid = grid.map((row) => [...row])
  const temp = newGrid[row1][col1]
  newGrid[row1][col1] = newGrid[row2][col2]
  newGrid[row2][col2] = temp
  return newGrid
}

export interface Match {
  row: number
  col: number
}

export function findMatches(grid: Gem[][]): Match[] {
  const matches: Match[] = []
  const matched = new Set<string>()

  // Check horizontal matches
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length - 2; j++) {
      if (grid[i][j] === grid[i][j + 1] && grid[i][j] === grid[i][j + 2]) {
        let k = j
        while (k < grid[i].length && grid[i][k] === grid[i][j]) {
          matched.add(`${i},${k}`)
          k++
        }
      }
    }
  }

  // Check vertical matches
  for (let i = 0; i < grid.length - 2; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === grid[i + 1][j] && grid[i][j] === grid[i + 2][j]) {
        let k = i
        while (k < grid.length && grid[k][j] === grid[i][j]) {
          matched.add(`${k},${j}`)
          k++
        }
      }
    }
  }

  matched.forEach((pos) => {
    const [row, col] = pos.split(",").map(Number)
    matches.push({ row, col })
  })

  return matches
}

export function removeMatches(grid: Gem[][], matches: Match[]): Gem[][] {
  const newGrid = grid.map((row) => [...row])

  matches.forEach(({ row, col }) => {
    newGrid[row][col] = "" as Gem
  })

  return newGrid
}

export function applyGravity(grid: Gem[][]): Gem[][] {
  const newGrid = grid.map((row) => [...row])

  for (let col = 0; col < newGrid[0].length; col++) {
    let emptyRow = newGrid.length - 1

    for (let row = newGrid.length - 1; row >= 0; row--) {
      if (newGrid[row][col] !== "") {
        if (row !== emptyRow) {
          newGrid[emptyRow][col] = newGrid[row][col]
          newGrid[row][col] = "" as Gem
        }
        emptyRow--
      }
    }
  }

  return newGrid
}

export function fillEmpty(grid: Gem[][]): Gem[][] {
  const newGrid = grid.map((row) => [...row])

  for (let i = 0; i < newGrid.length; i++) {
    for (let j = 0; j < newGrid[i].length; j++) {
      if (newGrid[i][j] === "") {
        newGrid[i][j] = GEMS[Math.floor(Math.random() * GEMS.length)]
      }
    }
  }

  return newGrid
}

export function calculateScore(matchCount: number): number {
  return matchCount * 10
}
