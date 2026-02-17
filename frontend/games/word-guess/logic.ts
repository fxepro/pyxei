export type LetterStatus = "correct" | "present" | "absent" | "empty"

export interface GuessLetter {
  letter: string
  status: LetterStatus
}

export interface Guess {
  word: string
  letters: GuessLetter[]
}

const WORD_LIST = [
  "REACT",
  "CHESS",
  "GAMES",
  "BRAIN",
  "LOGIC",
  "SMART",
  "THINK",
  "SOLVE",
  "MATCH",
  "SCORE",
  "LEVEL",
  "POWER",
  "SKILL",
  "FOCUS",
  "QUICK",
  "SHARP",
  "BOOST",
  "FLASH",
  "SPEED",
  "TIMER",
  "BOARD",
  "PIECE",
  "MOVES",
  "TURNS",
  "PLAYS",
  "ROUND",
  "STAGE",
  "PHASE",
  "QUEST",
  "PRIZE",
]

export function getRandomWord(): string {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
}

export function checkGuess(guess: string, targetWord: string): GuessLetter[] {
  const result: GuessLetter[] = []
  const targetLetters = targetWord.split("")
  const guessLetters = guess.split("")

  const letterCounts = new Map<string, number>()
  targetLetters.forEach((letter) => {
    letterCounts.set(letter, (letterCounts.get(letter) || 0) + 1)
  })

  guessLetters.forEach((letter, index) => {
    if (letter === targetLetters[index]) {
      result.push({ letter, status: "correct" })
      letterCounts.set(letter, (letterCounts.get(letter) || 0) - 1)
    } else {
      result.push({ letter, status: "empty" })
    }
  })

  result.forEach((item, index) => {
    if (item.status === "empty") {
      const letter = guessLetters[index]
      if (targetLetters.includes(letter) && (letterCounts.get(letter) || 0) > 0) {
        item.status = "present"
        letterCounts.set(letter, (letterCounts.get(letter) || 0) - 1)
      } else {
        item.status = "absent"
      }
    }
  })

  return result
}

export function isValidWord(word: string): boolean {
  return word.length === 5 && /^[A-Z]+$/.test(word)
}

export function calculateScore(guesses: number, won: boolean): number {
  if (!won) return 0
  const baseScore = 1000
  const guessBonus = (7 - guesses) * 200
  return baseScore + guessBonus
}

export function getKeyboardStatus(guesses: Guess[]): Map<string, LetterStatus> {
  const keyboardMap = new Map<string, LetterStatus>()

  guesses.forEach((guess) => {
    guess.letters.forEach(({ letter, status }) => {
      const currentStatus = keyboardMap.get(letter)
      if (status === "correct" || currentStatus !== "correct") {
        if (status === "present" && currentStatus === "absent") {
          keyboardMap.set(letter, "present")
        } else if (status !== "empty") {
          keyboardMap.set(letter, status)
        }
      }
    })
  })

  return keyboardMap
}
