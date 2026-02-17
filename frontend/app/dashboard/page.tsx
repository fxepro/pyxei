"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser, getGameProgress, type User, type GameProgress } from "@/lib/auth"
import { games } from "@/data/games"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<GameProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    setProgress(getGameProgress())
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </>
    )
  }

  const totalPoints = progress.reduce((sum, p) => sum + p.totalPoints, 0)
  const totalGames = progress.reduce((sum, p) => sum + p.gamesPlayed, 0)
  const totalWins = progress.reduce((sum, p) => sum + p.wins, 0)
  const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : "0"

  const recentGames = [...progress]
    .sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime())
    .slice(0, 5)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground">Track your progress across all games</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Points</CardDescription>
                  <CardTitle className="text-3xl">{totalPoints.toLocaleString()}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Games Played</CardDescription>
                  <CardTitle className="text-3xl">{totalGames}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Wins</CardDescription>
                  <CardTitle className="text-3xl">{totalWins}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Win Rate</CardDescription>
                  <CardTitle className="text-3xl">{winRate}%</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Games</CardTitle>
                  <CardDescription>Your last 5 played games</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentGames.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No games played yet. Start playing!</p>
                  ) : (
                    <div className="space-y-4">
                      {recentGames.map((gameProgress) => {
                        const game = games.find((g) => g.slug === gameProgress.gameSlug)
                        if (!game) return null
                        return (
                          <Link key={gameProgress.gameSlug} href={`/game/${game.slug}`}>
                            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{game.emoji}</span>
                                <div>
                                  <p className="font-medium">{game.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(gameProgress.lastPlayed).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{gameProgress.bestScore}</p>
                                <p className="text-sm text-muted-foreground">Best Score</p>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Games Progress</CardTitle>
                  <CardDescription>Your stats across all 20 games</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {games.map((game) => {
                      const gameProgress = progress.find((p) => p.gameSlug === game.slug)
                      return (
                        <Link key={game.slug} href={`/game/${game.slug}`}>
                          <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{game.emoji}</span>
                              <div>
                                <p className="font-medium text-sm">{game.name}</p>
                                {gameProgress ? (
                                  <p className="text-xs text-muted-foreground">
                                    {gameProgress.gamesPlayed} games • {gameProgress.wins}W {gameProgress.losses}L
                                  </p>
                                ) : (
                                  <p className="text-xs text-muted-foreground">Not played yet</p>
                                )}
                              </div>
                            </div>
                            {gameProgress && (
                              <div className="text-right">
                                <p className="font-bold text-sm">{gameProgress.totalPoints}</p>
                                <p className="text-xs text-muted-foreground">pts</p>
                              </div>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Link href="/">
                <Button size="lg">Browse All Games</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
