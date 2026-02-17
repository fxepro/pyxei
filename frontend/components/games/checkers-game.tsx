"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CheckersGameProps {
  onGameEnd: (score: number) => void
}

export function CheckersGame({ onGameEnd }: CheckersGameProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold">Checkers</h2>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">⚫</p>
          <p className="text-muted-foreground mb-6">Full Checkers game coming soon!</p>
        </div>
        <Button onClick={() => onGameEnd(75)}>Finish Demo</Button>
      </div>
    </Card>
  )
}
