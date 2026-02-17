"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ReactionGameProps {
  onGameEnd: (score: number) => void
}

export function ReactionGame({ onGameEnd }: ReactionGameProps) {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "click" | "result">("waiting")
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(0)

  const startGame = () => {
    setGameState("ready")
    const delay = Math.random() * 3000 + 2000
    setTimeout(() => {
      setGameState("click")
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "click") {
      const time = Date.now() - startTime
      setReactionTime(time)
      setGameState("result")
    } else if (gameState === "ready") {
      setGameState("waiting")
      alert("Too early! Wait for the green screen.")
    }
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold">Reaction Time Test</h2>

        <button
          onClick={handleClick}
          className={`w-full max-w-md h-64 rounded-lg text-2xl font-bold transition-colors ${
            gameState === "waiting"
              ? "bg-blue-500 text-white"
              : gameState === "ready"
                ? "bg-red-500 text-white"
                : gameState === "click"
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
          }`}
        >
          {gameState === "waiting" && "Click to Start"}
          {gameState === "ready" && "Wait..."}
          {gameState === "click" && "Click Now!"}
          {gameState === "result" && `${reactionTime}ms`}
        </button>

        {gameState === "waiting" && (
          <Button onClick={startGame} size="lg">
            Start Test
          </Button>
        )}

        {gameState === "result" && (
          <div className="text-center">
            <p className="text-lg mb-4">
              Your reaction time: <span className="font-bold text-primary">{reactionTime}ms</span>
            </p>
            <div className="flex gap-4">
              <Button onClick={() => setGameState("waiting")}>Try Again</Button>
              <Button variant="outline" onClick={() => onGameEnd(Math.max(0, 100 - reactionTime / 10))}>
                Finish
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
