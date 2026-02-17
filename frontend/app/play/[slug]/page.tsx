import type React from "react"
import { notFound } from "next/navigation"
import { games } from "@/data/games"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ChessGame } from "@/games/chess"
import { SudokuGame } from "@/games/sudoku"
import { CrosswordGame } from "@/components/games/crossword-game"
import { WordGuessGame } from "@/components/games/word-guess-game"
import { Match3Game } from "@/components/games/match3-game"
import { TetrisGame } from "@/components/games/tetris-game"
import { Game2048 } from "@/components/games/2048-game"
import { MinesweeperGame } from "@/components/games/minesweeper-game"
import { SolitaireGame } from "@/components/games/solitaire-game"
import { CheckersGame } from "@/components/games/checkers-game"
import { GoGame } from "@/components/games/go-game"
import { MemoryGame } from "@/components/games/memory-game"
import { ConnectFourGame } from "@/components/games/connect-four-game"
import { DominoesGame } from "@/components/games/dominoes-game"
import { MahjongGame } from "@/components/games/mahjong-game"
import { HexGame } from "@/components/games/hex-game"
import { BubbleShooterGame } from "@/components/games/bubble-shooter-game"
import { KakuroGame } from "@/components/games/kakuro-game"
import { ReactionGame } from "@/components/games/reaction-game"
import { MiniSportsGame } from "@/components/games/mini-sports-game"

export function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const game = games.find((g) => g.slug === params.slug)

  if (!game) {
    return {
      title: "Game Not Found",
    }
  }

  return {
    title: `Play ${game.name} - Pyxei`,
    description: `Play ${game.name} - ${game.tagline}`,
  }
}

const gameComponents: Record<string, React.ComponentType<{ onGameEnd: (score: number) => void; gameMode?: string }>> = {
  chess: ChessGame,
  sudoku: SudokuGame,
  crossword: CrosswordGame,
  "word-guess": WordGuessGame,
  "match-3": Match3Game,
  tetris: TetrisGame,
  "2048": Game2048,
  minesweeper: MinesweeperGame,
  solitaire: SolitaireGame,
  checkers: CheckersGame,
  go: GoGame,
  memory: MemoryGame,
  "connect-four": ConnectFourGame,
  dominoes: DominoesGame,
  mahjong: MahjongGame,
  hex: HexGame,
  "bubble-shooter": BubbleShooterGame,
  kakuro: KakuroGame,
  reaction: ReactionGame,
  "mini-sports": MiniSportsGame,
}

export default function PlayPage({
  params,
  searchParams,
}: { params: { slug: string }; searchParams: { mode?: string } }) {
  const game = games.find((g) => g.slug === params.slug)
  const gameMode = searchParams.mode || "pvp"

  if (!game) {
    notFound()
  }

  const GameComponent = gameComponents[game.slug]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href={`/game/${game.slug}`}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Info
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{game.emoji}</span>
            <h1 className="text-2xl font-bold text-foreground">{game.name}</h1>
          </div>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {GameComponent ? (
            game.slug === "chess" ? (
              <GameComponent
                gameMode={gameMode}
                onGameEnd={(score) => {
                  window.location.href = `/play/${game.slug}/results?score=${score}`
                }}
              />
            ) : (
              <GameComponent
                onGameEnd={(score) => {
                  window.location.href = `/play/${game.slug}/results?score=${score}`
                }}
              />
            )
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Game coming soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
