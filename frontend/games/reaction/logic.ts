export type ReactionGameMode = "classic" | "sequence" | "rhythm"

export interface ReactionState {
  mode: ReactionGameMode
  score: number
  round: number
  totalRounds: number
  isWaiting: boolean
  canClick: boolean
  reactionTimes: number[]
  averageTime: number
  bestTime: number
  gameOver: boolean
  startTime: number | null
}

export const createInitialState = (mode: ReactionGameMode = "classic"): ReactionState => ({
  mode,
  score: 0,
  round: 0,
  totalRounds: mode === "classic" ? 5 : mode === "sequence" ? 10 : 8,
  isWaiting: false,
  canClick: false,
  reactionTimes: [],
  averageTime: 0,
  bestTime: Number.POSITIVE_INFINITY,
  gameOver: false,
  startTime: null,
})

export const calculateScore = (reactionTime: number): number => {
  if (reactionTime < 200) return 100
  if (reactionTime < 300) return 80
  if (reactionTime < 400) return 60
  if (reactionTime < 500) return 40
  return 20
}

export const getRandomDelay = (): number => {
  return Math.random() * 3000 + 1000 // 1-4 seconds
}

export const calculateAverageTime = (times: number[]): number => {
  if (times.length === 0) return 0
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
}

export const getRating = (avgTime: number): string => {
  if (avgTime < 200) return "Lightning Fast"
  if (avgTime < 300) return "Excellent"
  if (avgTime < 400) return "Good"
  if (avgTime < 500) return "Average"
  return "Keep Practicing"
}
