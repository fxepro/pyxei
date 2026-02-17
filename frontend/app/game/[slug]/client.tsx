"use client"

import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft, Users, Clock, Trophy, MessageSquare, Star, Target, Zap, Gamepad2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface GamePageClientProps {
  game:
    | {
        id: number
        slug: string
        name: string
        tagline: string
        description: string
        emoji: string
      }
    | undefined
}

export function GamePageClient({ game }: GamePageClientProps) {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<string | null>(null)

  if (!game) {
    notFound()
  }

  const liveStats = {
    playersOnline: Math.floor(Math.random() * 5000) + 1000,
    avgSession: Math.floor(Math.random() * 15) + 5,
    leaderboardEntries: Math.floor(Math.random() * 2000) + 500,
    newChallenges: Math.floor(Math.random() * 50) + 10,
  }

  const skillLevel = game.id % 3 === 0 ? "Expert" : game.id % 2 === 0 ? "Intermediate" : "Beginner"
  const skillProgress = skillLevel === "Expert" ? 90 : skillLevel === "Intermediate" ? 60 : 30

  const objectives = [
    { text: "Complete your first game", reward: "Unlock Daily Challenges" },
    { text: "Win 3 games in a row", reward: "Earn Streak Badge" },
    { text: "Play 5 days in a row", reward: "Unlock Night Mode" },
  ]

  const topPlayers = [
    { name: "Alex_Pro", score: "12,450", flag: "🇺🇸" },
    { name: "GameMaster", score: "11,890", flag: "🇬🇧" },
    { name: "PuzzleKing", score: "10,230", flag: "🇨🇦" },
    { name: "StrategyQueen", score: "9,870", flag: "🇦🇺" },
    { name: "ChampionX", score: "9,450", flag: "🇩🇪" },
  ]

  const isChess = game.slug === "chess"
  const gameModes = isChess
    ? [
        { id: "pvp", label: "Player vs Player", description: "Play locally with a friend" },
        { id: "ai-easy", label: "vs AI (Easy)", description: "Random moves, great for beginners" },
        { id: "ai-medium", label: "vs AI (Medium)", description: "Smart moves with strategy" },
      ]
    : null

  const handlePlayNow = () => {
    if (isChess && selectedMode) {
      router.push(`/play/${game.slug}?mode=${selectedMode}`)
    } else if (isChess) {
      // If chess but no mode selected, default to pvp
      router.push(`/play/${game.slug}?mode=pvp`)
    } else {
      router.push(`/play/${game.slug}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>
        </Link>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">{game.emoji}</div>
            <h1 className="text-5xl font-bold text-foreground mb-4">{game.name}</h1>
            <p className="text-xl text-muted-foreground italic">{game.tagline}</p>
          </div>

          <div className="grid gap-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                About the Game
              </h2>
              <p className="text-muted-foreground leading-relaxed">{game.description}</p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <h2 className="text-2xl font-bold text-foreground mb-6">Live Stats</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{liveStats.playersOnline.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">players online now</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{liveStats.avgSession} min</p>
                    <p className="text-sm text-muted-foreground">average session</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {liveStats.leaderboardEntries.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">leaderboard entries</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{liveStats.newChallenges}</p>
                    <p className="text-sm text-muted-foreground">new challenges today</p>
                  </div>
                </div>
              </div>
            </Card>

            {isChess && gameModes && (
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Gamepad2 className="h-6 w-6 text-primary" />
                  Choose Your Game Mode
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {gameModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        selectedMode === mode.id
                          ? "border-primary bg-primary/20 shadow-lg scale-105"
                          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <h3 className="font-bold text-foreground mb-2">{mode.label}</h3>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-8">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Skill & Difficulty
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Difficulty Level</span>
                    <span className="text-sm font-bold text-foreground">{skillLevel}</span>
                  </div>
                  <Progress value={skillProgress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Expert</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Objectives & Rewards
                </h2>
                <div className="space-y-3">
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{objective.text}</p>
                        <p className="text-xs text-primary mt-1">🎁 {objective.reward}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="flex justify-center my-8">
              <Button
                size="lg"
                onClick={handlePlayNow}
                className="w-full max-w-md text-xl py-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isChess && selectedMode
                  ? `🎮 Play ${gameModes.find((m) => m.id === selectedMode)?.label}`
                  : "🎮 Play Now"}
              </Button>
            </div>

            <Card className="p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Top Players This Week
              </h2>
              <div className="space-y-3">
                {topPlayers.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-muted-foreground w-8">#{index + 1}</span>
                      <span className="text-2xl">{player.flag}</span>
                      <span className="font-medium text-foreground">{player.name}</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{player.score}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" className="w-full bg-transparent">
                  Join Community Discord
                </Button>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-secondary/50 to-secondary/20">
              <h2 className="text-xl font-bold text-foreground mb-6">Your Personal Stats</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground mt-1">Games Played</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">8,450</p>
                  <p className="text-sm text-muted-foreground mt-1">Best Score</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">5 days</p>
                  <p className="text-sm text-muted-foreground mt-1">Current Streak</p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">Last played: 2 hours ago</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
