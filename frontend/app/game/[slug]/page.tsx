import { games } from "@/data/games"
import { GamePageClient } from "@/app/game/[slug]/client"
import { notFound } from "next/navigation"

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
    title: `${game.name} - Pyxei`,
    description: game.description,
  }
}

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = games.find((g) => g.slug === params.slug)

  if (!game) {
    notFound()
  }

  return <GamePageClient game={game} />
}
