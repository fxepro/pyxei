"use client"

import { useSearchParams } from "next/navigation"
import { games } from "@/data/games"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { RotateCcw, Home } from "lucide-react"
import { motion } from "framer-motion"

export default function ResultsPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()
  const score = searchParams.get("score") || "0"
  const game = games.find((g) => g.slug === params.slug)

  if (!game) {
    notFound()
  }

  const numericScore = Number.parseInt(score)
  const getRating = (score: number) => {
    if (score >= 90) return { text: "Outstanding!", emoji: "🏆", color: "text-yellow-500" }
    if (score >= 70) return { text: "Great Job!", emoji: "🌟", color: "text-blue-500" }
    if (score >= 50) return { text: "Good Effort!", emoji: "👍", color: "text-green-500" }
    return { text: "Keep Practicing!", emoji: "💪", color: "text-orange-500" }
  }

  const rating = getRating(numericScore)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <Card className="p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-8xl mb-6"
            >
              {rating.emoji}
            </motion.div>

            <h1 className="text-4xl font-bold text-foreground mb-2">Game Complete!</h1>
            <p className={`text-2xl font-semibold mb-8 ${rating.color}`}>{rating.text}</p>

            <div className="mb-8">
              <div className="text-6xl font-bold text-primary mb-2">{score}</div>
              <p className="text-muted-foreground">Your Score</p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="text-4xl">{game.emoji}</span>
              <h2 className="text-2xl font-bold text-foreground">{game.name}</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/play/${game.slug}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Play Again
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Try another game</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {games
                  .filter((g) => g.slug !== game.slug)
                  .slice(0, 5)
                  .map((g) => (
                    <Link key={g.slug} href={`/game/${g.slug}`}>
                      <Button variant="ghost" size="sm">
                        <span className="mr-2">{g.emoji}</span>
                        {g.name}
                      </Button>
                    </Link>
                  ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
