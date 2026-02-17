import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-foreground mb-1">Pyxei</h3>
            <p className="text-sm text-muted-foreground mb-4 font-mono">pyxei.com</p>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Dots. Connects. Pyxies. Play in your browser, then explore what’s behind each game—markets, competitors,
              and why they stick.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Strategy Games</li>
              <li className="text-muted-foreground">Puzzle Games</li>
              <li className="text-muted-foreground">Card Games</li>
              <li className="text-muted-foreground">Board Games</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Pyxei (pyxei.com). All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
