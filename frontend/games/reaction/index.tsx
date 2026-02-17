"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  createInitialState,
  calculateScore,
  getRandomDelay,
  calculateAverageTime,
  getRating,
  type ReactionGameMode,
  type ReactionState,
} from "./logic"

interface ReactionGameProps {
  onGameEnd: (score: number, stats: { moves: number; time: number }) => void
  gameMode?: string
}

export default function ReactionGame({ onGameEnd, gameMode = "classic" }: ReactionGameProps) {
  const [state, setState] = useState<ReactionState>(createInitialState(gameMode as ReactionGameMode))
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startRound = () => {
    setState((prev) => ({ ...prev, isWaiting: true, canClick: false }))

    const delay = getRandomDelay()
    timeoutRef.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isWaiting: false,
        canClick: true,
        startTime: Date.now(),
      }))
    }, delay)
  }

  const handleClick = () => {
    if (state.isWaiting) {
      // Clicked too early
      setState((prev) => ({
        ...prev,
        isWaiting: false,
        canClick: false,
      }))
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      alert("Too early! Wait for the green signal.")
      startRound()
      return
    }

    if (!state.canClick) return

    const reactionTime = Date.now() - (state.startTime || Date.now())
    const roundScore = calculateScore(reactionTime)
    const newReactionTimes = [...state.reactionTimes, reactionTime]
    const newRound = state.round + 1

    setState((prev) => ({
      ...prev,
      score: prev.score + roundScore,
      round: newRound,
      reactionTimes: newReactionTimes,
      averageTime: calculateAverageTime(newReactionTimes),
      bestTime: Math.min(prev.bestTime, reactionTime),
      canClick: false,
      startTime: null,
    }))

    if (newRound >= state.totalRounds) {
      const avgTime = calculateAverageTime(newReactionTimes)
      setState((prev) => ({ ...prev, gameOver: true }))
      onGameEnd(state.score + roundScore, {
        moves: newRound,
        time: avgTime,
      })
    } else {
      setTimeout(() => startRound(), 1000)
    }
  }

  const resetGame = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setState(createInitialState(state.mode))
  }

  useEffect(() => {
    startRound()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (state.gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <h2 className="text-3xl font-bold">Game Complete!</h2>
        <Card className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-lg">Final Score: {state.score}</p>
            <p className="text-lg">Average Time: {state.averageTime}ms</p>
            <p className="text-lg">Best Time: {state.bestTime}ms</p>
            <p className="text-2xl font-bold mt-4">{getRating(state.averageTime)}</p>
          </div>
        </Card>
        <Button onClick={resetGame} size="lg">
          Play Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          Round {state.round + 1} / {state.totalRounds}
        </h2>
        <p className="text-lg">Score: {state.score}</p>
        {state.bestTime !== Number.POSITIVE_INFINITY && (
          <p className="text-sm text-muted-foreground">Best: {state.bestTime}ms</p>
        )}
      </div>

      <button
        onClick={handleClick}
        className={`w-64 h-64 rounded-lg transition-all duration-200 text-2xl font-bold ${
          state.isWaiting
            ? "bg-red-500 hover:bg-red-600"
            : state.canClick
              ? "bg-green-500 hover:bg-green-600 animate-pulse"
              : "bg-gray-300 hover:bg-gray-400"
        }`}
        disabled={state.gameOver}
      >
        {state.isWaiting ? "Wait..." : state.canClick ? "Click Now!" : "Click to Start"}
      </button>

      <div className="text-center text-sm text-muted-foreground max-w-md">
        {!state.canClick && !state.isWaiting && (
          <p>Click the box to start. Wait for it to turn green, then click as fast as you can!</p>
        )}
        {state.isWaiting && <p>Wait for green... Don&apos;t click yet!</p>}
        {state.canClick && <p>Click now!</p>}
      </div>
    </div>
  )
}
