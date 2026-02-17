export type Suit = "hearts" | "diamonds" | "clubs" | "spades"
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K"

export interface Card {
  suit: Suit
  rank: Rank
  faceUp: boolean
}

export interface GameState {
  stock: Card[]
  waste: Card[]
  foundations: Card[][]
  tableau: Card[][]
}

const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"]

export function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, faceUp: false })
    }
  }
  return shuffleDeck(deck)
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function initializeGame(): GameState {
  const deck = createDeck()
  const tableau: Card[][] = Array(7)
    .fill(null)
    .map(() => [])

  let deckIndex = 0
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[deckIndex++]
      card.faceUp = row === col
      tableau[col].push(card)
    }
  }

  const stock = deck.slice(deckIndex).map((card) => ({ ...card, faceUp: false }))

  return {
    stock,
    waste: [],
    foundations: [[], [], [], []],
    tableau,
  }
}

export function getRankValue(rank: Rank): number {
  return RANKS.indexOf(rank)
}

export function isRed(suit: Suit): boolean {
  return suit === "hearts" || suit === "diamonds"
}

export function canPlaceOnTableau(card: Card, targetCard: Card | undefined): boolean {
  if (!targetCard) {
    return card.rank === "K"
  }

  const cardValue = getRankValue(card.rank)
  const targetValue = getRankValue(targetCard.rank)

  return cardValue === targetValue - 1 && isRed(card.suit) !== isRed(targetCard.suit)
}

export function canPlaceOnFoundation(card: Card, foundation: Card[]): boolean {
  if (foundation.length === 0) {
    return card.rank === "A"
  }

  const topCard = foundation[foundation.length - 1]
  return card.suit === topCard.suit && getRankValue(card.rank) === getRankValue(topCard.rank) + 1
}

export function checkWin(state: GameState): boolean {
  return state.foundations.every((foundation) => foundation.length === 13)
}

export function drawFromStock(state: GameState): GameState {
  if (state.stock.length === 0) {
    return {
      ...state,
      stock: [...state.waste].reverse().map((card) => ({ ...card, faceUp: false })),
      waste: [],
    }
  }

  const newStock = [...state.stock]
  const card = newStock.pop()!
  card.faceUp = true

  return {
    ...state,
    stock: newStock,
    waste: [...state.waste, card],
  }
}
