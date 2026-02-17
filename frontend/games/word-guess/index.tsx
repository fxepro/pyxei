"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  getRandomWord,
  checkGuess,
  isValidWord,
  calculateScore,
  getKeyboardStatus,
  type Guess,
  type LetterStatus,
} from "./logic"

interface WordGuessGameProps {
  onGameEnd: (score: number) => void
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
]

export function WordGuessGame({ onGameEnd }: WordGuessGameProps) {
  const [targetWord, setTargetWord] = useState(getRandomWord())
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [error, setError] = useState("")

  const maxGuesses = 6
  const keyboardStatus = getKeyboardStatus(guesses)

  useEffect(() => {
    if (gameOver) {
      const score = calculateScore(guesses.length, won)
      setTimeout(() => onGameEnd(score), 1500)
    }
  }, [gameOver, won, guesses.length, onGameEnd])

  const handleSubmitGuess = () => {
    setError("")

    if (currentGuess.length !== 5) {
      setError("Word must be 5 letters")
      return
    }

    if (!isValidWord(currentGuess)) {
      setError("Invalid word")
      return
    }

    const guessResult = checkGuess(currentGuess, targetWord)
    const newGuess: Guess = {
      word: currentGuess,
      letters: guessResult,
    }

    const newGuesses = [...guesses, newGuess]
    setGuesses(newGuesses)
    setCurrentGuess("")

    if (currentGuess === targetWord) {
      setWon(true)
      setGameOver(true)
    } else if (newGuesses.length >= maxGuesses) {
      setGameOver(true)
    }
  }

  const handleKeyPress = (key: string) => {
    if (gameOver) return

    if (key === "ENTER") {
      handleSubmitGuess()
    } else if (key === "⌫") {
      setCurrentGuess((prev) => prev.slice(0, -1))
    } else if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key)
    }
  }

  const handleReset = () => {
    setTargetWord(getRandomWord())
    setGuesses([])
    setCurrentGuess("")
    setGameOver(false)
    setWon(false)
    setError("")
  }

  const getLetterColor = (status: LetterStatus) => {
    switch (status) {
      case "correct":
        return "bg-green-500 border-green-600 text-white"
      case "present":
        return "bg-yellow-500 border-yellow-600 text-white"
      case "absent":
        return "bg-gray-400 border-gray-500 text-white"
      default:
        return "bg-white border-gray-300"
    }
  }

  const getKeyColor = (letter: string) => {
    const status = keyboardStatus.get(letter)
    if (!status) return "bg-gray-200 hover:bg-gray-300"

    switch (status) {
      case "correct":
        return "bg-green-500 text-white"
      case "present":
        return "bg-yellow-500 text-white"
      case "absent":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-200 hover:bg-gray-300"
    }
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Word Guess</h2>
          <p className="text-muted-foreground">Guess the 5-letter word in {maxGuesses} tries</p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
            const guess = guesses[rowIndex]
            const isCurrentRow = rowIndex === guesses.length && !gameOver

            return (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {Array.from({ length: 5 }).map((_, colIndex) => {
                  const letter = guess?.letters[colIndex]
                  const currentLetter = isCurrentRow ? currentGuess[colIndex] : ""

                  return (
                    <div
                      key={colIndex}
                      className={`w-14 h-14 border-2 rounded flex items-center justify-center text-2xl font-bold uppercase transition-all ${
                        letter
                          ? getLetterColor(letter.status)
                          : currentLetter
                            ? "border-gray-400 bg-white"
                            : "border-gray-300 bg-white"
                      }`}
                    >
                      {letter?.letter || currentLetter}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

        {gameOver && (
          <div className="text-center">
            <div className={`text-2xl font-bold mb-2 ${won ? "text-green-600" : "text-red-600"}`}>
              {won ? "You Won!" : "Game Over"}
            </div>
            <div className="text-lg mb-4">
              The word was: <span className="font-bold">{targetWord}</span>
            </div>
            <div className="text-muted-foreground">Score: {calculateScore(guesses.length, won)}</div>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1 justify-center">
              {row.map((key) => (
                <Button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  disabled={gameOver}
                  className={`${key.length > 1 ? "px-4" : "px-3"} py-6 text-sm font-semibold ${getKeyColor(key)}`}
                  variant="outline"
                >
                  {key}
                </Button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={handleReset}>New Game</Button>
          {!gameOver && (
            <Button variant="outline" onClick={() => onGameEnd(0)}>
              Give Up
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
