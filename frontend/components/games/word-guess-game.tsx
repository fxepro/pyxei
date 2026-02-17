"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WordGuessGameProps {
  onGameEnd: (score: number) => void
}

const WORDS = ["REACT", "CHESS", "GAMES", "BENTO", "PIXEL", "CLOUD", "MAGIC", "SWIFT"]

export function WordGuessGame({ onGameEnd }: WordGuessGameProps) {
  const [targetWord, setTargetWord] = useState("")
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)])
  }, [])

  const handleSubmit = () => {
    if (currentGuess.length !== 5) return

    const newGuesses = [...guesses, currentGuess.toUpperCase()]
    setGuesses(newGuesses)
    setCurrentGuess("")

    if (currentGuess.toUpperCase() === targetWord) {
      setGameOver(true)
      const score = Math.max(0, 100 - newGuesses.length * 15)
      setTimeout(() => onGameEnd(score), 1500)
    } else if (newGuesses.length >= 6) {
      setGameOver(true)
      setTimeout(() => onGameEnd(0), 1500)
    }
  }

  const getLetterColor = (letter: string, index: number, guess: string) => {
    if (targetWord[index] === letter) return "bg-green-500 text-white"
    if (targetWord.includes(letter)) return "bg-yellow-500 text-white"
    return "bg-gray-500 text-white"
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold">Guess the 5-letter word!</h2>

        <div className="flex flex-col gap-2 w-full">
          {guesses.map((guess, guessIndex) => (
            <div key={guessIndex} className="flex gap-2 justify-center">
              {guess.split("").map((letter, letterIndex) => (
                <div
                  key={letterIndex}
                  className={`w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 ${getLetterColor(
                    letter,
                    letterIndex,
                    guess,
                  )}`}
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}

          {!gameOver && guesses.length < 6 && (
            <div className="flex gap-2 justify-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 border-border"
                  >
                    {currentGuess[i] || ""}
                  </div>
                ))}
            </div>
          )}
        </div>

        {!gameOver && (
          <div className="flex gap-2 w-full">
            <Input
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value.toUpperCase().slice(0, 5))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter word"
              maxLength={5}
              className="text-center text-xl"
            />
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        )}

        {gameOver && (
          <div className="text-center">
            <p className="text-xl font-semibold mb-2">
              {guesses[guesses.length - 1] === targetWord ? "You won!" : "Game Over!"}
            </p>
            <p className="text-muted-foreground">The word was: {targetWord}</p>
          </div>
        )}

        <div className="text-sm text-muted-foreground">Attempts: {guesses.length}/6</div>
      </div>
    </Card>
  )
}
