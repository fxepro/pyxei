"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MiniSportsGameProps {
  onGameEnd: (score: number) => void
}

type Sport = "penalty" | "basketball" | "golf"

export function MiniSportsGame({ onGameEnd }: MiniSportsGameProps) {
  const [currentSport, setCurrentSport] = useState<Sport>("penalty")
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())

  const [penaltyTarget, setPenaltyTarget] = useState({ x: 0, y: 0 })
  const [basketballPower, setBasketballPower] = useState(0)
  const [golfPower, setGolfPower] = useState(0)
  const [powerIncreasing, setPowerIncreasing] = useState(true)

  useEffect(() => {
    if (gameActive && currentSport === "basketball") {
      const interval = setInterval(() => {
        setBasketballPower((prev) => {
          if (powerIncreasing) {
            if (prev >= 100) {
              setPowerIncreasing(false)
              return 100
            }
            return prev + 2
          } else {
            if (prev <= 0) {
              setPowerIncreasing(true)
              return 0
            }
            return prev - 2
          }
        })
      }, 30)
      return () => clearInterval(interval)
    }
  }, [gameActive, currentSport, powerIncreasing])

  useEffect(() => {
    if (gameActive && currentSport === "golf") {
      const interval = setInterval(() => {
        setGolfPower((prev) => {
          if (powerIncreasing) {
            if (prev >= 100) {
              setPowerIncreasing(false)
              return 100
            }
            return prev + 3
          } else {
            if (prev <= 0) {
              setPowerIncreasing(true)
              return 0
            }
            return prev - 3
          }
        })
      }, 40)
      return () => clearInterval(interval)
    }
  }, [gameActive, currentSport, powerIncreasing])

  const startGame = (sport: Sport) => {
    setCurrentSport(sport)
    setGameActive(true)
    setScore(0)
    setAttempts(0)
    setStartTime(Date.now())
    if (sport === "penalty") {
      setPenaltyTarget({
        x: Math.random() * 200 - 100,
        y: Math.random() * 100 - 50,
      })
    }
  }

  const handlePenaltyShoot = (x: number, y: number) => {
    if (attempts >= 5) return

    const distance = Math.sqrt(Math.pow(x - penaltyTarget.x, 2) + Math.pow(y - penaltyTarget.y, 2))

    if (distance < 40) {
      setScore((prev) => prev + 10)
    }

    setAttempts((prev) => prev + 1)
    if (attempts + 1 >= 5) {
      finishGame()
    } else {
      setPenaltyTarget({
        x: Math.random() * 200 - 100,
        y: Math.random() * 100 - 50,
      })
    }
  }

  const handleBasketballShoot = () => {
    if (attempts >= 10) return

    if (basketballPower >= 40 && basketballPower <= 80) {
      setScore((prev) => prev + 2)
    }

    setAttempts((prev) => prev + 1)
    if (attempts + 1 >= 10) {
      finishGame()
    }
  }

  const handleGolfSwing = () => {
    if (attempts >= 9) return

    const accuracy = 100 - Math.abs(golfPower - 75)
    if (accuracy > 50) {
      setScore((prev) => prev + Math.floor(accuracy / 10))
    }

    setAttempts((prev) => prev + 1)
    if (attempts + 1 >= 9) {
      finishGame()
    }
  }

  const finishGame = () => {
    setGameActive(false)
    setShowResults(true)
  }

  const handleCheckResults = () => {
    onGameEnd(score)
  }

  const timeElapsed = Math.floor((Date.now() - startTime) / 1000)

  if (!gameActive && !showResults) {
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <h2 className="text-3xl font-bold">Choose Your Sport</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startGame("penalty")}>
            <div className="text-center">
              <div className="text-6xl mb-4">⚽</div>
              <h3 className="text-xl font-bold mb-2">Penalty Kicks</h3>
              <p className="text-sm text-muted-foreground">Score 5 penalties</p>
            </div>
          </Card>
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => startGame("basketball")}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🏀</div>
              <h3 className="text-xl font-bold mb-2">Basketball</h3>
              <p className="text-sm text-muted-foreground">Make 10 shots</p>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startGame("golf")}>
            <div className="text-center">
              <div className="text-6xl mb-4">⛳</div>
              <h3 className="text-xl font-bold mb-2">Mini Golf</h3>
              <p className="text-sm text-muted-foreground">Complete 9 holes</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="p-6 max-w-md w-full">
          <h3 className="text-2xl font-bold mb-4 text-center">Game Complete!</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span>Sport:</span>
              <span className="font-bold capitalize">{currentSport}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Final Score:</span>
              <span className="font-bold">{score}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Attempts:</span>
              <span className="font-bold">{attempts}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Time:</span>
              <span>
                {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => window.location.reload()} className="flex-1">
                Play Again
              </Button>
              <Button onClick={() => (window.location.href = "/")} variant="outline" className="flex-1">
                Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div className="text-lg font-semibold capitalize">{currentSport}</div>
        <div className="flex gap-4 text-sm">
          <div>Score: {score}</div>
          <div>
            Attempts: {attempts}/{currentSport === "penalty" ? 5 : currentSport === "basketball" ? 10 : 9}
          </div>
        </div>
      </div>

      {currentSport === "penalty" && (
        <div className="relative w-full max-w-md h-64 bg-green-600 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-32 bg-white/20 border-4 border-white rounded-t-full" />
          </div>
          <button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left - rect.width / 2
              const y = e.clientY - rect.top - rect.height / 2
              handlePenaltyShoot(x, y)
            }}
            className="absolute inset-0 cursor-crosshair"
          >
            <div
              className="absolute w-8 h-8 bg-red-500 rounded-full animate-pulse"
              style={{
                left: `calc(50% + ${penaltyTarget.x}px)`,
                top: `calc(50% + ${penaltyTarget.y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </button>
        </div>
      )}

      {currentSport === "basketball" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-md h-64 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
            <div className="text-white text-6xl">🏀</div>
          </div>
          <div className="w-full max-w-md">
            <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all"
                style={{ width: `${basketballPower}%` }}
              />
            </div>
            <p className="text-center mt-2 text-sm text-muted-foreground">Hit between 40-80% for a basket!</p>
          </div>
          <Button onClick={handleBasketballShoot} size="lg">
            Shoot!
          </Button>
        </div>
      )}

      {currentSport === "golf" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-md h-64 bg-gradient-to-b from-green-400 to-green-600 rounded-lg flex items-center justify-center relative">
            <div className="absolute bottom-8 text-6xl">⛳</div>
            <div className="absolute top-8 text-4xl">⚪</div>
          </div>
          <div className="w-full max-w-md">
            <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 transition-all"
                style={{ width: `${golfPower}%` }}
              />
            </div>
            <p className="text-center mt-2 text-sm text-muted-foreground">Hit close to 75% for best accuracy!</p>
          </div>
          <Button onClick={handleGolfSwing} size="lg">
            Swing!
          </Button>
        </div>
      )}
    </div>
  )
}
