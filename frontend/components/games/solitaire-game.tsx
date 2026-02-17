"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SolitaireGameProps {
  onGameEnd: (score: number) => void
}

export function SolitaireGame({ onGameEnd }: SolitaireGameProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold">Solitaire</h2>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🃏</p>
          <p className="text-muted-foreground mb-6">Full Solitaire game coming soon!</p>
          <p className="text-sm text-muted-foreground max-w-md">
            This will include the classic Klondike Solitaire with drag-and-drop cards, foundation piles, and tableau
            stacks.
          </p>
        </div>
        <Button onClick={() => onGameEnd(75)}>Finish Demo</Button>
      </div>
    </Card>
  )
}
