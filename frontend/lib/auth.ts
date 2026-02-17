"use client"

// Simple placeholder auth using localStorage
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface GameProgress {
  gameSlug: string
  gamesPlayed: number
  bestScore: number
  totalPoints: number
  lastPlayed: string
  wins: number
  losses: number
}

export function login(email: string, password: string): User | null {
  // Placeholder login - accepts any email/password
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name: email.split("@")[0],
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem("user", JSON.stringify(user))

  // Initialize empty progress if not exists
  if (!localStorage.getItem("gameProgress")) {
    localStorage.setItem("gameProgress", JSON.stringify([]))
  }

  return user
}

export function logout() {
  localStorage.removeItem("user")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export function getGameProgress(): GameProgress[] {
  if (typeof window === "undefined") return []
  const progressStr = localStorage.getItem("gameProgress")
  return progressStr ? JSON.parse(progressStr) : []
}

export function updateGameProgress(gameSlug: string, score: number, won: boolean) {
  const progress = getGameProgress()
  const existingIndex = progress.findIndex((p) => p.gameSlug === gameSlug)

  if (existingIndex >= 0) {
    progress[existingIndex].gamesPlayed++
    progress[existingIndex].totalPoints += score
    progress[existingIndex].bestScore = Math.max(progress[existingIndex].bestScore, score)
    progress[existingIndex].lastPlayed = new Date().toISOString()
    if (won) progress[existingIndex].wins++
    else progress[existingIndex].losses++
  } else {
    progress.push({
      gameSlug,
      gamesPlayed: 1,
      bestScore: score,
      totalPoints: score,
      lastPlayed: new Date().toISOString(),
      wins: won ? 1 : 0,
      losses: won ? 0 : 1,
    })
  }

  localStorage.setItem("gameProgress", JSON.stringify(progress))
}
