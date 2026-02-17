"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mahjong Solitaire (tile matching game)
interface Tile {
  id: number
  type: string
  layer: number
  row: number
  col: number
  isMatched: boolean
  isBlocked: boolean
}

interface MahjongGameProps {
  onGameEnd: (score: number) => void
  difficulty?: string
}

const TILE_TYPES = ["🀄", "🀅", "🀆", "🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏", "🀐", "🀑"]

function generateLayout(): Tile[] {
  const tiles: Tile[] = []
  let id = 0

  // Classic pyramid layout (simplified)
  const layout = [
    // Layer 0 (bottom)
    {
      layer: 0,
      positions: [
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4],
        [2, 5],
        [2, 6],
        [2, 7],
        [2, 8],
        [2, 9],
        [2, 10],
        [2, 11],
        [3, 2],
        [3, 3],
        [3, 4],
        [3, 5],
        [3, 6],
        [3, 7],
        [3, 8],
        [3, 9],
        [3, 10],
        [4, 1],
        [4, 2],
        [4, 3],
        [4, 4],
        [4, 5],
        [4, 6],
        [4, 7],
        [4, 8],
        [4, 9],
        [4, 10],
        [4, 11],
      ],
    },
    // Layer 1 (middle)
    {
      layer: 1,
      positions: [
        [2, 3],
        [2, 5],
        [2, 7],
        [2, 9],
        [3, 4],
        [3, 6],
        [3, 8],
        [4, 3],
        [4, 5],
        [4, 7],
        [4, 9],
      ],
    },
    // Layer 2 (top)
    { layer: 2, positions: [[3, 6]] },
  ]

  const allPositions: Array<{ layer: number; row: number; col: number }> = []
  layout.forEach((l) => {
    l.positions.forEach(([row, col]) => {
      allPositions.push({ layer: l.layer, row, col })
    })
  })

  // Ensure even number of tiles
  const numPairs = Math.floor(allPositions.length / 2)
  const selectedPositions = allPositions.slice(0, numPairs * 2)

  // Create pairs
  const types: string[] = []
  for (let i = 0; i < numPairs; i++) {
    const type = TILE_TYPES[i % TILE_TYPES.length]
    types.push(type, type)
  }

  // Shuffle types
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[types[i], types[j]] = [types[j], types[i]]
  }

  // Create tiles
  selectedPositions.forEach((pos, idx) => {
    tiles.push({
      id: id++,
      type: types[idx],
      layer: pos.layer,
      row: pos.row,
      col: pos.col,
      isMatched: false,
      isBlocked: false,
    })
  })

  return tiles
}

function updateBlockedStatus(tiles: Tile[]): Tile[] {
  return tiles.map((tile) => {
    if (tile.isMatched) return tile

    // Check if blocked by tiles on top
    const hasTopTile = tiles.some(
      (t) =>
        !t.isMatched &&
        t.layer === tile.layer + 1 &&
        Math.abs(t.row - tile.row) <= 1 &&
        Math.abs(t.col - tile.col) <= 1,
    )

    if (hasTopTile) {
      return { ...tile, isBlocked: true }
    }

    // Check if blocked by adjacent tiles (left and right)
    const leftBlocked = tiles.some(
      (t) => !t.isMatched && t.layer === tile.layer && t.row === tile.row && t.col === tile.col - 1,
    )

    const rightBlocked = tiles.some(
      (t) => !t.isMatched && t.layer === tile.layer && t.row === tile.row && t.col === tile.col + 1,
    )

    return { ...tile, isBlocked: leftBlocked && rightBlocked }
  })
}

export function MahjongGame({ onGameEnd, difficulty = "medium" }: MahjongGameProps) {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([])
  const [matchedCount, setMatchedCount] = useState(0)
  const [startTime] = useState(Date.now())
  const [showResults, setShowResults] = useState(false)
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    const initialTiles = generateLayout()
    setTiles(updateBlockedStatus(initialTiles))
  }, [])

  const handleTileClick = (tile: Tile) => {
    if (tile.isMatched || tile.isBlocked || showResults) return

    if (selectedTiles.length === 0) {
      setSelectedTiles([tile])
    } else if (selectedTiles.length === 1) {
      if (selectedTiles[0].id === tile.id) {
        setSelectedTiles([])
        return
      }

      if (selectedTiles[0].type === tile.type) {
        // Match found
        const newTiles = tiles.map((t) => {
          if (t.id === tile.id || t.id === selectedTiles[0].id) {
            return { ...t, isMatched: true }
          }
          return t
        })
        setTiles(updateBlockedStatus(newTiles))
        setMatchedCount(matchedCount + 2)
        setSelectedTiles([])
        setMoves(moves + 1)

        // Check if game is complete
        if (matchedCount + 2 === tiles.length) {
          const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
          const score = Math.max(0, 1000 - timeElapsed - moves * 5)
          setTimeout(() => {
            setShowResults(true)
          }, 500)
        }
      } else {
        // No match
        setSelectedTiles([tile])
        setMoves(moves + 1)
      }
    }
  }

  const handleNewGame = () => {
    const initialTiles = generateLayout()
    setTiles(updateBlockedStatus(initialTiles))
    setSelectedTiles([])
    setMatchedCount(0)
    setShowResults(false)
    setMoves(0)
  }

  const handleSubmit = () => {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const completionRate = (matchedCount / tiles.length) * 100
    const score = Math.max(0, Math.floor(completionRate * 10 - timeElapsed - moves * 5))
    onGameEnd(score)
  }

  const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
  const score = Math.max(0, 1000 - timeElapsed - moves * 5)

  return (
    <Card className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-6">
            <div className="text-sm">
              <span className="text-muted-foreground">Matched:</span>{" "}
              <span className="font-bold">
                {matchedCount}/{tiles.length}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Moves:</span> <span className="font-bold">{moves}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Time:</span> <span className="font-bold">{timeElapsed}s</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleNewGame}>
              New Game
            </Button>
            <Button variant="outline" size="sm" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative min-h-[500px] bg-gradient-to-br from-green-900/20 to-green-700/20 rounded-lg p-8">
          {tiles.map((tile) => {
            const isSelected = selectedTiles.some((t) => t.id === tile.id)
            const zIndex = tile.layer * 100 + tile.row * 10 + tile.col

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={tile.isMatched || tile.isBlocked}
                className={`absolute w-12 h-16 rounded border-2 flex items-center justify-center text-2xl font-bold transition-all
                  ${tile.isMatched ? "opacity-0 pointer-events-none" : ""}
                  ${tile.isBlocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
                  ${isSelected ? "border-yellow-400 bg-yellow-100 scale-105 shadow-lg" : "border-amber-700 bg-gradient-to-br from-amber-100 to-amber-200 shadow-md"}
                `}
                style={{
                  left: `${tile.col * 40 + tile.layer * 4}px`,
                  top: `${tile.row * 50 + tile.layer * 4}px`,
                  zIndex,
                }}
              >
                {tile.type}
              </button>
            )
          })}
        </div>

        {/* Results Overlay */}
        {showResults && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 max-w-md w-full mx-4">
              <div className="flex flex-col items-center gap-6">
                <div className="text-6xl">🎉</div>
                <h2 className="text-3xl font-bold">Puzzle Complete!</h2>

                <div className="w-full space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Final Score:</span>
                    <span className="font-bold text-2xl">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Moves:</span>
                    <span className="font-semibold">{moves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-semibold">{timeElapsed}s</span>
                  </div>
                </div>

                <div className="flex gap-3 w-full">
                  <Button onClick={handleNewGame} variant="outline" className="flex-1 bg-transparent">
                    New Puzzle
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1">
                    View Results
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Card>
  )
}
