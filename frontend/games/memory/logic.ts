export interface Card {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

export const CARD_EMOJIS = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  "🦆",
  "🦅",
  "🦉",
  "🦇",
  "🐺",
]

export function createDeck(pairCount = 8): Card[] {
  const selectedEmojis = CARD_EMOJIS.slice(0, pairCount)
  const pairs = [...selectedEmojis, ...selectedEmojis]

  return pairs
    .map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5)
}

export function canFlipCard(card: Card, flippedCards: Card[]): boolean {
  return !card.isFlipped && !card.isMatched && flippedCards.length < 2
}

export function checkMatch(card1: Card, card2: Card): boolean {
  return card1.value === card2.value
}

export function calculateScore(moves: number, matches: number, timeElapsed: number): number {
  const baseScore = matches * 100
  const moveBonus = Math.max(0, 1000 - moves * 10)
  const timeBonus = Math.max(0, 500 - Math.floor(timeElapsed / 2))

  return baseScore + moveBonus + timeBonus
}

export function isGameComplete(cards: Card[]): boolean {
  return cards.every((card) => card.isMatched)
}
