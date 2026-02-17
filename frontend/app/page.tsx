import { games } from "@/data/games"
import { BentoCard } from "@/components/bento-card"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-20 py-20">
          <h1 className="text-7xl md:text-8xl font-bold text-foreground mb-6 text-balance">
            Your stop for the games everyone knows
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Play in your browser, then explore what’s behind each game—markets, competitors, and why they stick
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <BentoCard key={game.id} game={game} index={index} />
          ))}
        </div>
      </main>
    </div>
  )
}
