import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-8xl mb-6">🎮</div>
          <h1 className="text-5xl font-bold text-foreground mb-4">Game Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! The game you're looking for doesn't exist in our collection.
          </p>
          <Link href="/">
            <Button size="lg">Back to All Games</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
