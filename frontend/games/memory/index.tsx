"use client"

import { useState, useEffect } from "react"
import { Card as UICard } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createDeck, canFlipCard, checkMatch, calculateScore, isGameComplete, type Card } from "./logic"

interface MemoryGameProps {
  onGameEnd: (score: number) => void
  difficulty?: string
}

export function MemoryGame({ onGameEnd, difficulty = "medium" }: MemoryGameProps) {
  const pairCount = difficulty === "easy" ? 6 : difficulty === "hard" ? 12 : 8

  const [cards, setCards] = useState<Card[]>(createDeck(pairCount))
  const [flippedCards, setFlippedCards] = useState<Card[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [startTime] = useState(Date.now())
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true)
      setMoves((prev) => prev + 1)

      const [card1, card2] = flippedCards

      if (checkMatch(card1, card2)) {
        setCards((prevCards) =>
          prevCards.map((card) => (card.id === card1.id || card.id === card2.id ? { ...card, isMatched: true } : card)),
        )
        setMatches((prev) => prev + 1)
        setFlippedCards([])
        setIsChecking(false)
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === card1.id || card.id === card2.id ? { ...card, isFlipped: false } : card,
            ),
          )
          setFlippedCards([])
          setIsChecking(false)
        }, 1000)
      }
    }
  }, [flippedCards])

  useEffect(() => {
    if (isGameComplete(cards) && matches > 0) {
      setTimeout(() => {
        const finalScore = calculateScore(moves, matches, timeElapsed)
        onGameEnd(finalScore)
      }, 500)
    }
  }, [cards, matches, moves, timeElapsed, onGameEnd])

  const handleCardClick = (clickedCard: Card) => {
    if (isChecking || !canFlipCard(clickedCard, flippedCards)) return

    setCards((prevCards) => prevCards.map((card) => (card.id === clickedCard.id ? { ...card, isFlipped: true } : card)))
    setFlippedCards((prev) => [...prev, clickedCard])
  }

  const handleReset = () => {
    setCards(createDeck(pairCount))
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setTimeElapsed(0)
    setIsChecking(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <UICard className="p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 w-full max-w-2xl">
          <div className="text-2xl font-bold">Memory Match</div>
          <div className="flex gap-6 text-lg">
            <span>Moves: {moves}</span>
            <span>
              Matches: {matches}/{pairCount}
            </span>
            <span>Time: {formatTime(timeElapsed)}</span>
          </div>
          <div className="text-sm text-muted-foreground capitalize">Difficulty: {difficulty}</div>
        </div>

        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${pairCount <= 6 ? 3 : 4}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={card.isFlipped || card.isMatched || isChecking}
              className={`w-20 h-20 rounded-lg flex items-center justify-center text-4xl font-bold transition-all transform ${
                card.isFlipped || card.isMatched
                  ? "bg-gradient-to-br from-blue-400 to-purple-500 scale-100"
                  : "bg-gradient-to-br from-gray-300 to-gray-400 hover:scale-105"
              } ${card.isMatched ? "opacity-50" : ""} disabled:cursor-not-allowed shadow-lg`}
            >
              {card.isFlipped || card.isMatched ? card.value : "?"}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={handleReset}>New Game</Button>
          <Button variant="outline" onClick={() => onGameEnd(calculateScore(moves, matches, timeElapsed))}>
            End Game
          </Button>
        </div>
      </div>
    </UICard>
  )
}
