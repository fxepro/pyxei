import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "About - Pyxei",
  description: "Learn about Pyxei — dots, connects, pyxies. Your stop for the games everyone knows.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-8 text-center">About Pyxei</h1>
          <p className="text-center text-xl text-muted-foreground mb-12 font-mono">pyxei.com · Dots. Connects. Pyxies.</p>

          <div className="grid gap-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pyxei is your stop for the games everyone knows. We connect play with context: pick a game, play in your
                browser, then explore market potential, monetization strategies, and competitive landscapes behind each
                one.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you’re a developer, investor, or enthusiast, we give you the dots—and the connections—to see
                why these games stick and how they perform in the real world.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why These Games?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Games like Solitaire, Chess, and Match-3 have generated billions in revenue and kept huge player bases
                for decades. They prove that complexity isn’t required for success.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Clear rules, engaging mechanics, and accessibility create experiences that resonate with millions
                worldwide. Pyxei is where those dots connect.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">What We Offer</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">📊</span>
                  <span>Market analysis and revenue estimates across our catalog</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎯</span>
                  <span>Competitive landscape and key players in each category</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💰</span>
                  <span>Monetization strategies and business models</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎮</span>
                  <span>Play in-browser and see what makes each game stick</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
