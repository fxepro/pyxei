"use client"

import { useState, useEffect } from "react"
import { Card as UICard } from "@/components/ui/card"
import {
  initializeGame,
  canPlaceOnTableau,
  canPlaceOnFoundation,
  checkWin,
  drawFromStock,
  isRed,
  type GameState,
  type Card,
  type Suit,
} from "./logic"

interface SolitaireGameProps {
  onGameEnd: (won: boolean) => void
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
}

function CardComponent({
  card,
  onClick,
  className = "",
}: { card: Card | null; onClick?: () => void; className?: string }) {
  if (!card) {
    return (
      <div
        className={`w-16 h-24 border-2 border-dashed border-gray-600 rounded bg-gray-800/50 ${className}`}
        onClick={onClick}
      />
    )
  }

  if (!card.faceUp) {
    return (
      <div
        className={`w-16 h-24 border-2 border-gray-600 rounded bg-blue-900 flex items-center justify-center ${className}`}
        onClick={onClick}
      >
        <div className="text-2xl">🂠</div>
      </div>
    )
  }

  const color = isRed(card.suit) ? "text-red-500" : "text-gray-900"

  return (
    <div
      className={`w-16 h-24 border-2 border-gray-600 rounded bg-white flex flex-col items-center justify-between p-1 cursor-pointer hover:ring-2 hover:ring-blue-500 ${className}`}
      onClick={onClick}
    >
      <div className={`text-lg font-bold ${color}`}>
        {card.rank}
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div className={`text-3xl ${color}`}>{SUIT_SYMBOLS[card.suit]}</div>
      <div className={`text-lg font-bold ${color} rotate-180`}>
        {card.rank}
        {SUIT_SYMBOLS[card.suit]}
      </div>
    </div>
  )
}

export default function SolitaireGame({ onGameEnd }: SolitaireGameProps) {
  const [gameState, setGameState] = useState<GameState>(initializeGame())
  const [selectedCard, setSelectedCard] = useState<{
    source: "waste" | "tableau" | "foundation"
    index: number
    cardIndex?: number
  } | null>(null)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)

  useEffect(() => {
    if (checkWin(gameState)) {
      setWon(true)
      onGameEnd(true)
    }
  }, [gameState, onGameEnd])

  const handleStockClick = () => {
    setGameState(drawFromStock(gameState))
    setMoves((prev) => prev + 1)
  }

  const handleWasteClick = () => {
    if (gameState.waste.length > 0) {
      setSelectedCard({ source: "waste", index: 0 })
    }
  }

  const handleTableauClick = (colIndex: number, cardIndex?: number) => {
    const column = gameState.tableau[colIndex]
    if (column.length === 0) return

    const clickedIndex = cardIndex ?? column.length - 1
    const card = column[clickedIndex]

    if (!card.faceUp) return

    if (selectedCard) {
      // Try to place selected card
      const targetCard = column[column.length - 1]
      let canPlace = false
      let cardsToMove: Card[] = []

      if (selectedCard.source === "waste") {
        const wasteCard = gameState.waste[gameState.waste.length - 1]
        canPlace = canPlaceOnTableau(wasteCard, targetCard)
        cardsToMove = [wasteCard]
      } else if (selectedCard.source === "tableau") {
        const sourceColumn = gameState.tableau[selectedCard.index]
        cardsToMove = sourceColumn.slice(selectedCard.cardIndex)
        canPlace = canPlaceOnTableau(cardsToMove[0], targetCard)
      }

      if (canPlace) {
        const newState = { ...gameState }

        if (selectedCard.source === "waste") {
          newState.waste = newState.waste.slice(0, -1)
        } else if (selectedCard.source === "tableau") {
          newState.tableau[selectedCard.index] = newState.tableau[selectedCard.index].slice(0, selectedCard.cardIndex)
          const lastCard = newState.tableau[selectedCard.index][newState.tableau[selectedCard.index].length - 1]
          if (lastCard) lastCard.faceUp = true
        }

        newState.tableau[colIndex] = [...newState.tableau[colIndex], ...cardsToMove]
        setGameState(newState)
        setMoves((prev) => prev + 1)
      }

      setSelectedCard(null)
    } else {
      setSelectedCard({ source: "tableau", index: colIndex, cardIndex: clickedIndex })
    }
  }

  const handleFoundationClick = (foundationIndex: number) => {
    if (!selectedCard) return

    let cardToPlace: Card | null = null
    const newState = { ...gameState }

    if (selectedCard.source === "waste") {
      cardToPlace = gameState.waste[gameState.waste.length - 1]
    } else if (selectedCard.source === "tableau") {
      const column = gameState.tableau[selectedCard.index]
      if (selectedCard.cardIndex !== column.length - 1) return
      cardToPlace = column[column.length - 1]
    }

    if (cardToPlace && canPlaceOnFoundation(cardToPlace, gameState.foundations[foundationIndex])) {
      if (selectedCard.source === "waste") {
        newState.waste = newState.waste.slice(0, -1)
      } else if (selectedCard.source === "tableau") {
        newState.tableau[selectedCard.index] = newState.tableau[selectedCard.index].slice(0, -1)
        const lastCard = newState.tableau[selectedCard.index][newState.tableau[selectedCard.index].length - 1]
        if (lastCard) lastCard.faceUp = true
      }

      newState.foundations[foundationIndex] = [...newState.foundations[foundationIndex], cardToPlace]
      setGameState(newState)
      setMoves((prev) => prev + 1)
    }

    setSelectedCard(null)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 min-h-screen">
      <UICard className="p-4">
        <div className="flex gap-8 text-sm">
          <div>
            <span className="text-muted-foreground">Moves:</span> <span className="font-bold">{moves}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Stock:</span>{" "}
            <span className="font-bold">{gameState.stock.length}</span>
          </div>
        </div>
      </UICard>

      <div className="flex gap-8">
        <div className="flex gap-2">
          <CardComponent
            card={gameState.stock.length > 0 ? gameState.stock[gameState.stock.length - 1] : null}
            onClick={handleStockClick}
          />
          <CardComponent
            card={gameState.waste.length > 0 ? gameState.waste[gameState.waste.length - 1] : null}
            onClick={handleWasteClick}
            className={selectedCard?.source === "waste" ? "ring-4 ring-blue-500" : ""}
          />
        </div>

        <div className="flex gap-2">
          {gameState.foundations.map((foundation, i) => (
            <CardComponent
              key={i}
              card={foundation.length > 0 ? foundation[foundation.length - 1] : null}
              onClick={() => handleFoundationClick(i)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {gameState.tableau.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-0">
            {column.length === 0 ? (
              <CardComponent card={null} onClick={() => handleTableauClick(colIndex)} />
            ) : (
              column.map((card, cardIndex) => (
                <CardComponent
                  key={cardIndex}
                  card={card}
                  onClick={() => handleTableauClick(colIndex, cardIndex)}
                  className={`${cardIndex > 0 ? "-mt-20" : ""} ${
                    selectedCard?.source === "tableau" &&
                    selectedCard.index === colIndex &&
                    selectedCard.cardIndex === cardIndex
                      ? "ring-4 ring-blue-500"
                      : ""
                  }`}
                />
              ))
            )}
          </div>
        ))}
      </div>

      {won && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl font-bold mb-4">You Won!</div>
            <div className="text-xl">Moves: {moves}</div>
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center">
        <div>Click cards to select, then click destination to move</div>
        <div>Build foundations from Ace to King by suit</div>
      </div>
    </div>
  )
}
