export interface Game {
  id: number
  name: string
  slug: string
  emoji: string
  tagline: string
  description: string
  monetization: string
  competitors: string[]
  estimatedRevenue: string
  playersActive?: number
  category?: string
  difficulty?: string
  avgSession?: string
}

export const games: Game[] = [
  {
    id: 1,
    name: "Chess",
    slug: "chess",
    emoji: "♟️",
    tagline: "Strategy and intellect in motion",
    description:
      "Classic board game with massive online community. Chess combines deep strategic thinking with tactical execution, making it one of the most enduring games in history. The digital chess market has exploded with millions of daily active users across platforms.",
    monetization: "Subscription, tournaments, ads, premium features",
    competitors: ["Chess.com", "Lichess", "Chess24"],
    estimatedRevenue: "$100M+ annually",
  },
  {
    id: 2,
    name: "Sudoku",
    slug: "sudoku",
    emoji: "🔢",
    tagline: "Logic puzzles that challenge your mind",
    description:
      "Number placement puzzle that requires logical thinking and pattern recognition. Sudoku has become a global phenomenon with millions of daily players. The game's simple rules but complex solutions make it perfect for mobile gaming.",
    monetization: "Ads, premium ad-free version, hint purchases",
    competitors: ["Sudoku.com", "Microsoft Sudoku", "Brainium Sudoku"],
    estimatedRevenue: "$50M+ annually",
  },
  {
    id: 3,
    name: "Crossword",
    slug: "crossword",
    emoji: "📝",
    tagline: "Word puzzles for vocabulary masters",
    description:
      "Classic word puzzle game that tests vocabulary and general knowledge. Crosswords have a dedicated daily audience and strong subscription potential. The New York Times Crossword alone has over 1 million subscribers.",
    monetization: "Subscription, daily puzzle packs, premium content",
    competitors: ["NYT Crossword", "Crossword Puzzle Free", "Wordscapes"],
    estimatedRevenue: "$75M+ annually",
  },
  {
    id: 4,
    name: "Word Guess",
    slug: "word-guess",
    emoji: "🔤",
    tagline: "Guess the word in six tries",
    description:
      "Viral word guessing game that took the world by storm. Simple mechanics with social sharing features create massive engagement. The game's daily challenge format keeps players coming back.",
    monetization: "Ads, premium features, merchandise",
    competitors: ["Wordle", "Quordle", "Heardle"],
    estimatedRevenue: "$30M+ annually",
  },
  {
    id: 5,
    name: "Match-3",
    slug: "match-3",
    emoji: "💎",
    tagline: "Swap and match colorful gems",
    description:
      "Highly addictive puzzle game where players match three or more items. Match-3 games dominate mobile gaming revenue with strong retention and monetization. The genre has proven staying power with games like Candy Crush.",
    monetization: "In-app purchases, lives system, boosters, ads",
    competitors: ["Candy Crush", "Bejeweled", "Toon Blast"],
    estimatedRevenue: "$2B+ annually (genre leader)",
  },
  {
    id: 6,
    name: "Tetris",
    slug: "tetris",
    emoji: "🧱",
    tagline: "The timeless falling blocks game",
    description:
      "Iconic puzzle game where players arrange falling blocks. Tetris is one of the best-selling games of all time with universal appeal. The game's simple mechanics and increasing difficulty create perfect flow state.",
    monetization: "Premium app, ads, battle royale mode subscriptions",
    competitors: ["Tetris (EA)", "Tetris 99", "Block Puzzle"],
    estimatedRevenue: "$80M+ annually",
  },
  {
    id: 7,
    name: "2048",
    slug: "2048",
    emoji: "🎯",
    tagline: "Combine tiles to reach 2048",
    description:
      "Addictive sliding tile puzzle game with simple rules but challenging gameplay. The game went viral due to its perfect balance of accessibility and difficulty. Minimal design makes it ideal for quick sessions.",
    monetization: "Ads, premium ad-free version, themes",
    competitors: ["2048 (original)", "Threes!", "1024"],
    estimatedRevenue: "$20M+ annually",
  },
  {
    id: 8,
    name: "Minesweeper",
    slug: "minesweeper",
    emoji: "💣",
    tagline: "Clear the board without hitting mines",
    description:
      "Classic logic game that requires deduction and careful planning. Minesweeper has nostalgic appeal and strong engagement from puzzle enthusiasts. The game's risk-reward mechanics create tension and excitement.",
    monetization: "Ads, premium features, custom boards",
    competitors: ["Microsoft Minesweeper", "Minesweeper Classic", "Antimine"],
    estimatedRevenue: "$15M+ annually",
  },
  {
    id: 9,
    name: "Solitaire",
    slug: "solitaire",
    emoji: "🃏",
    tagline: "The classic card game everyone knows",
    description:
      "Most popular single-player card game with massive casual audience. Solitaire has incredible retention rates and broad demographic appeal. The game's relaxing nature makes it perfect for stress relief.",
    monetization: "Ads, daily challenges, themes, premium version",
    competitors: ["Microsoft Solitaire", "Solitaire by MobilityWare", "Klondike"],
    estimatedRevenue: "$200M+ annually",
  },
  {
    id: 10,
    name: "Checkers",
    slug: "checkers",
    emoji: "⚫",
    tagline: "Strategic board game for two players",
    description:
      "Classic strategy game with simple rules but deep tactics. Checkers has strong multiplayer potential and competitive scene. The game's accessibility makes it perfect for casual and competitive players.",
    monetization: "Ads, multiplayer subscriptions, tournaments",
    competitors: ["Checkers Free", "Checkers Online", "Draughts"],
    estimatedRevenue: "$25M+ annually",
  },
  {
    id: 11,
    name: "Go",
    slug: "go",
    emoji: "⚪",
    tagline: "Ancient game of territorial strategy",
    description:
      "Complex strategy game with simple rules and infinite depth. Go has a dedicated global community and growing Western audience. The game's AI developments have sparked renewed interest.",
    monetization: "Subscription, lessons, tournaments, AI analysis",
    competitors: ["OGS", "KGS", "Pandanet"],
    estimatedRevenue: "$40M+ annually",
  },
  {
    id: 12,
    name: "Memory",
    slug: "memory",
    emoji: "🧠",
    tagline: "Match pairs and train your brain",
    description:
      "Card matching game that improves memory and concentration. Memory games have strong appeal for educational and brain training markets. The game works well for all ages and skill levels.",
    monetization: "Ads, premium themes, difficulty packs",
    competitors: ["Memory Games", "Brain Training", "Lumosity"],
    estimatedRevenue: "$35M+ annually",
  },
  {
    id: 13,
    name: "Connect Four",
    slug: "connect-four",
    emoji: "🔴",
    tagline: "Line up four in a row to win",
    description:
      "Strategic two-player game with perfect information. Connect Four has strong multiplayer potential and quick game sessions. The game's simple rules make it accessible while maintaining strategic depth.",
    monetization: "Ads, multiplayer features, tournaments",
    competitors: ["Connect 4", "Four in a Row", "Connect Four Online"],
    estimatedRevenue: "$20M+ annually",
  },
  {
    id: 14,
    name: "Dominoes",
    slug: "dominoes",
    emoji: "🀄",
    tagline: "Classic tile-matching game",
    description:
      "Traditional game with multiple variants and strong cultural appeal. Dominoes has dedicated communities in various regions. The game combines luck and strategy for engaging gameplay.",
    monetization: "Ads, multiplayer subscriptions, tournaments",
    competitors: ["Dominoes Gold", "Domino!", "Dominoes Online"],
    estimatedRevenue: "$30M+ annually",
  },
  {
    id: 15,
    name: "Mahjong",
    slug: "mahjong",
    emoji: "🎴",
    tagline: "Match tiles in this ancient game",
    description:
      "Traditional Chinese game with massive Asian market appeal. Mahjong solitaire variant has broad casual appeal. The game's beautiful tiles and relaxing gameplay create strong retention.",
    monetization: "Ads, tile sets, daily challenges, premium",
    competitors: ["Mahjong Solitaire", "Shanghai Mahjong", "Mahjong Journey"],
    estimatedRevenue: "$60M+ annually",
  },
  {
    id: 16,
    name: "Hex",
    slug: "hex",
    emoji: "⬡",
    tagline: "Connect your sides in this abstract game",
    description:
      "Abstract strategy game with elegant rules and deep gameplay. Hex has a dedicated competitive community and growing recognition. The game's mathematical properties make it fascinating for strategy enthusiasts.",
    monetization: "Premium app, AI training, tournaments",
    competitors: ["Hex Game", "Hexagonal", "Abstract Strategy Games"],
    estimatedRevenue: "$5M+ annually",
  },
  {
    id: 17,
    name: "Bubble Shooter",
    slug: "bubble-shooter",
    emoji: "🫧",
    tagline: "Pop bubbles and clear the board",
    description:
      "Casual arcade game with massive mobile appeal. Bubble Shooter games have incredible retention and monetization potential. The game's satisfying mechanics and colorful visuals drive engagement.",
    monetization: "Ads, lives system, boosters, level packs",
    competitors: ["Bubble Witch", "Bubble Shooter Pop", "Panda Pop"],
    estimatedRevenue: "$500M+ annually",
  },
  {
    id: 18,
    name: "Kakuro",
    slug: "kakuro",
    emoji: "➕",
    tagline: "Mathematical crossword puzzle",
    description:
      "Number puzzle that combines Sudoku and crosswords. Kakuro has a dedicated puzzle enthusiast audience. The game offers deep logical challenges for math lovers.",
    monetization: "Ads, premium puzzles, hint system",
    competitors: ["Kakuro (Conceptis)", "Cross Sums", "Logic Puzzles"],
    estimatedRevenue: "$10M+ annually",
  },
  {
    id: 19,
    name: "Reaction",
    slug: "reaction",
    emoji: "⚡",
    tagline: "Test your reflexes and timing",
    description:
      "Fast-paced game testing reaction time and rhythm. Reaction games have strong competitive appeal and social sharing potential. The game's quick sessions make it perfect for mobile.",
    monetization: "Ads, premium modes, leaderboards",
    competitors: ["Geometry Dash", "Beat Saber", "Rhythm Games"],
    estimatedRevenue: "$100M+ annually",
  },
  {
    id: 20,
    name: "Mini Sports",
    slug: "mini-sports",
    emoji: "⚽",
    tagline: "Quick sports challenges and mini-games",
    description:
      "Collection of bite-sized sports games like mini golf and penalty kicks. Mini sports games have broad appeal and high replay value. The variety keeps players engaged across multiple game modes.",
    monetization: "Ads, premium sports packs, multiplayer",
    competitors: ["Mini Golf King", "Flick Kick", "Sports Games"],
    estimatedRevenue: "$150M+ annually",
  },
]
