import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Pyxei — Dots. Connects. Pyxies.",
  description: "Play the games everyone knows. One place to connect, play in-browser, and explore what’s behind each game.",
  metadataBase: new URL("https://pyxei.com"),
  openGraph: { url: "https://pyxei.com" },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
