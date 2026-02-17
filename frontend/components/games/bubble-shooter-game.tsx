"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BubbleShooterGameProps {
  onGameEnd: (score: number) => void
  difficulty?: string
}

interface Bubble {
  row: number
  col: number
  color: string
  id: string
}

interface Position {
  x: number
  y: number
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"]
const BUBBLE_SIZE = 40
const COLS = 10
const INITIAL_ROWS = 8

export function BubbleShooterGame({ onGameEnd, difficulty = "medium" }: BubbleShooterGameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [currentBubble, setCurrentBubble] = useState<string>("")
  const [nextBubble, setNextBubble] = useState<string>("")
  const [angle, setAngle] = useState<number>(90)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [shooting, setShooting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [startTime] = useState(Date.now())
  const canvasRef = useRef<HTMLDivElement>(null)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const initialBubbles: Bubble[] = []
    for (let row = 0; row < INITIAL_ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (Math.random() > 0.2) {
          initialBubbles.push({
            row,
            col,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            id: `${row}-${col}`,
          })
        }
      }
    }
    setBubbles(initialBubbles)
    setCurrentBubble(COLORS[Math.floor(Math.random() * COLORS.length)])
    setNextBubble(COLORS[Math.floor(Math.random() * COLORS.length)])
    setScore(0)
    setGameOver(false)
    setShowResults(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shooting || gameOver) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const shooterX = rect.width / 2
    const shooterY = rect.height - 60
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const dx = mouseX - shooterX
    const dy = mouseY - shooterY
    let newAngle = (Math.atan2(-dy, dx) * 180) / Math.PI + 90

    // Limit angle between 20 and 160 degrees
    newAngle = Math.max(20, Math.min(160, newAngle))
    setAngle(newAngle)
  }

  const shoot = () => {
    if (shooting || gameOver) return
    setShooting(true)

    // Calculate trajectory
    const radians = ((angle - 90) * Math.PI) / 180
    const dx = Math.cos(radians)
    const dy = -Math.sin(radians)

    // Simulate bubble movement and collision
    setTimeout(() => {
      // Find closest position to snap to
      const newRow = Math.floor(Math.random() * 3) // Simplified collision detection
      const newCol = Math.floor(Math.random() * COLS)

      const newBubble: Bubble = {
        row: newRow,
        col: newCol,
        color: currentBubble,
        id: `${newRow}-${newCol}-${Date.now()}`,
      }

      const updatedBubbles = [...bubbles, newBubble]

      // Check for matches
      const matches = findMatches(updatedBubbles, newBubble)

      if (matches.length >= 3) {
        // Remove matched bubbles
        const remainingBubbles = updatedBubbles.filter((b) => !matches.some((m) => m.id === b.id))

        // Remove floating bubbles
        const connectedBubbles = getConnectedBubbles(remainingBubbles)
        setBubbles(connectedBubbles)

        const bubblesPopped = updatedBubbles.length - connectedBubbles.length
        setScore((prev) => prev + bubblesPopped * 10)
      } else {
        setBubbles(updatedBubbles)
      }

      // Check game over
      const maxRow = Math.max(...updatedBubbles.map((b) => b.row), 0)
      if (maxRow >= 15) {
        setGameOver(true)
        setShowResults(true)
      }

      // Check win condition
      if (updatedBubbles.length === 0) {
        setGameOver(true)
        setShowResults(true)
      }

      setCurrentBubble(nextBubble)
      setNextBubble(COLORS[Math.floor(Math.random() * COLORS.length)])
      setShooting(false)
    }, 500)
  }

  const findMatches = (allBubbles: Bubble[], bubble: Bubble): Bubble[] => {
    const matches: Bubble[] = [bubble]
    const checked = new Set<string>([bubble.id])
    const toCheck = [bubble]

    while (toCheck.length > 0) {
      const current = toCheck.pop()!
      const neighbors = getNeighbors(allBubbles, current)

      for (const neighbor of neighbors) {
        if (!checked.has(neighbor.id) && neighbor.color === bubble.color) {
          checked.add(neighbor.id)
          matches.push(neighbor)
          toCheck.push(neighbor)
        }
      }
    }

    return matches
  }

  const getNeighbors = (allBubbles: Bubble[], bubble: Bubble): Bubble[] => {
    const neighbors: Bubble[] = []
    const offsets = [
      [-1, -1],
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
    ]

    for (const [dr, dc] of offsets) {
      const neighbor = allBubbles.find((b) => b.row === bubble.row + dr && b.col === bubble.col + dc)
      if (neighbor) neighbors.push(neighbor)
    }

    return neighbors
  }

  const getConnectedBubbles = (allBubbles: Bubble[]): Bubble[] => {
    const connected = new Set<string>()
    const toCheck = allBubbles.filter((b) => b.row === 0)

    toCheck.forEach((b) => connected.add(b.id))

    let i = 0
    while (i < toCheck.length) {
      const current = toCheck[i]
      const neighbors = getNeighbors(allBubbles, current)

      for (const neighbor of neighbors) {
        if (!connected.has(neighbor.id)) {
          connected.add(neighbor.id)
          toCheck.push(neighbor)
        }
      }
      i++
    }

    return allBubbles.filter((b) => connected.has(b.id))
  }

  const getBubblePosition = (row: number, col: number): Position => {
    const offsetX = row % 2 === 1 ? BUBBLE_SIZE / 2 : 0
    return {
      x: col * BUBBLE_SIZE + offsetX + 20,
      y: row * BUBBLE_SIZE + 20,
    }
  }

  const handleFinish = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    onGameEnd(score)
  }

  if (showResults) {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    const bubblesCleared = INITIAL_ROWS * COLS - bubbles.length

    return (
      <Card className="p-8">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold">Game Over!</h2>

          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">Final Score</div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">{bubblesCleared}</div>
              <div className="text-sm text-muted-foreground">Bubbles Cleared</div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">{timeTaken}s</div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">{bubbles.length === 0 ? "Win!" : "Try Again"}</div>
              <div className="text-sm text-muted-foreground">Result</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={initializeGame} variant="outline">
              Play Again
            </Button>
            <Button onClick={handleFinish}>Back to Games</Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-between w-full max-w-2xl">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="text-lg font-semibold">{gameOver ? "Game Over" : "Playing"}</div>
        </div>

        <div
          ref={canvasRef}
          className="relative bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 rounded-lg overflow-hidden cursor-crosshair"
          style={{ width: COLS * BUBBLE_SIZE + 40, height: 600 }}
          onMouseMove={handleMouseMove}
          onClick={shoot}
        >
          {/* Bubbles */}
          {bubbles.map((bubble) => {
            const pos = getBubblePosition(bubble.row, bubble.col)
            return (
              <div
                key={bubble.id}
                className="absolute rounded-full border-2 border-white shadow-lg transition-all"
                style={{
                  width: BUBBLE_SIZE - 4,
                  height: BUBBLE_SIZE - 4,
                  backgroundColor: bubble.color,
                  left: pos.x,
                  top: pos.y,
                }}
              />
            )
          })}

          {/* Shooter */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            style={{
              width: BUBBLE_SIZE,
              height: BUBBLE_SIZE,
            }}
          >
            {/* Aim line */}
            <div
              className="absolute bottom-1/2 left-1/2 w-1 bg-white/50 origin-bottom"
              style={{
                height: 100,
                transform: `translateX(-50%) rotate(${angle - 90}deg)`,
              }}
            />

            {/* Current bubble */}
            <div
              className="absolute rounded-full border-2 border-white shadow-lg"
              style={{
                width: BUBBLE_SIZE - 4,
                height: BUBBLE_SIZE - 4,
                backgroundColor: currentBubble,
                left: 2,
                top: 2,
              }}
            />
          </div>

          {/* Next bubble preview */}
          <div className="absolute bottom-4 right-4 flex flex-col items-center gap-2">
            <div className="text-xs text-muted-foreground">Next</div>
            <div
              className="rounded-full border-2 border-white shadow-lg"
              style={{
                width: BUBBLE_SIZE - 8,
                height: BUBBLE_SIZE - 8,
                backgroundColor: nextBubble,
              }}
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center max-w-md">
          Move your mouse to aim, click to shoot. Match 3 or more bubbles of the same color to pop them!
        </div>
      </div>
    </Card>
  )
}
