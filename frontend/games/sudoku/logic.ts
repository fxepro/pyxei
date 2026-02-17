export function generateSudoku(): number[][] {
  const board = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0))
  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ]

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (Math.random() > 0.4) {
        board[i][j] = solution[i][j]
      }
    }
  }
  return board
}

export function isValidSudoku(board: number[][]): boolean {
  // Check rows
  for (let i = 0; i < 9; i++) {
    const row = new Set(board[i].filter((n) => n !== 0))
    if (row.size !== board[i].filter((n) => n !== 0).length) return false
  }
  return true
}

export function calculateScore(mistakes: number): number {
  return Math.max(0, 100 - mistakes * 10)
}
