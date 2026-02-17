"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface MemoryGameProps {
  onGameEnd: (score: number) => void
}

const EMOJIS = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎬", "🎤"]

export function MemoryGame({ onGameEnd }: MemoryGameProps) {
  const [cards, setCards] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    const shuffled = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5)
    setCards(shuffled)
  }, [])

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setTimeout(() => onGameEnd(Math.max(0, 100 - moves * 5)), 1000)
    }
  }, [matched])

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-between w-full max-w-md">
          <div className="text-lg font-semibold">Moves: {moves}</div>
          <div className="text-lg font-semibold">Matched: {matched.length / 2}/8</div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-20 h-20 flex items-center justify-center text-4xl rounded-lg transition-all ${
                flipped.includes(index) || matched.includes(index)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {flipped.includes(index) || matched.includes(index) ? card : "?"}
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}
