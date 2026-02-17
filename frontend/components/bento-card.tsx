"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import type { Game } from "@/data/games"

interface BentoCardProps {
  game: Game
  index: number
}

const cardColors = [
  "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  "from-orange-500/20 to-red-500/20 border-orange-500/30",
  "from-green-500/20 to-emerald-500/20 border-green-500/30",
  "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
  "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
  "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
]

export function BentoCard({ game, index }: BentoCardProps) {
  const colorClass = cardColors[index % cardColors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      className="h-full"
    >
      <Link href={`/game/${game.slug}`}>
        <Card
          className={`h-full p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-gradient-to-br ${colorClass} border-2 group`}
        >
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <motion.div
              className="text-6xl"
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              {game.emoji}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {game.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{game.tagline}</p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
