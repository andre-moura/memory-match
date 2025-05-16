"use client"

import { useState, useEffect } from "react"
import { CardGrid } from "@/components/molecules/card-grid"
import { ScoreDisplay } from "@/components/atoms/score-display"
import { GameControls } from "@/components/molecules/game-controls"
import { AudioButton } from "@/components/atoms/audio-button"
import { BackgroundEffect } from "@/components/atoms/background-effect"
import { Confetti } from "@/components/atoms/confetti"
import { motion } from "framer-motion"
import { Popup } from "../atoms/popup"

// Analytics tracking function
const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  console.log(`Analytics Event: ${eventName}`, eventData)
  // In a real implementation, you would send this to your analytics service
}

// Define the character images
const CHARACTER_IMAGES = [
  { id: 1, name: "Birdperson", path: "/images/Birdperson.png" },
  { id: 2, name: "Evil Morty", path: "/images/Evil Morty.png" },
  { id: 3, name: "Morty Smith", path: "/images/Morty Smith.png" },
  { id: 4, name: "Mr. Meeseeks", path: "/images/Mr. Meeseeks.png" },
  { id: 5, name: "Pickle Rick", path: "/images/Pickle Rick.png" },
  { id: 6, name: "Rick Sanchez", path: "/images/Rick Sanchez.png" },
  { id: 7, name: "Scary Terry", path: "/images/Scary Terry.png" },
  { id: 8, name: "Squanchy", path: "/images/Wild Squanchy.png" },
]

export function GameBoard() {
  const TOTAL_PAIRS = CHARACTER_IMAGES.length
  const [cards, setCards] = useState<
    Array<{
      id: number
      characterId: number
      isFlipped: boolean
      isMatched: boolean
    }>
  >([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [isCheckingMatch, setIsCheckingMatch] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
    trackEvent("game_started")
  }, [])

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === TOTAL_PAIRS && cards.length > 0) {
      setGameCompleted(true)
      setShowPopup(true)
      trackEvent("game_completed", { attempts })
    }
  }, [matchedPairs, cards.length, attempts])

  // Initialize game with shuffled cards
  const initializeGame = () => {
    const characterIds = CHARACTER_IMAGES.map(char => char.id)
    const cardPairs = [...characterIds, ...characterIds]
    const shuffledCards = shuffleArray(cardPairs).map((characterId, id) => ({
      id,
      characterId,
      isFlipped: false,
      isMatched: false,
    }))

    setCards(shuffledCards)
    setFlippedIndices([])
    setMatchedPairs(0)
    setAttempts(0)
    setGameCompleted(false)
    setShowPopup(false)
    trackEvent("new_game_started")
  }

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Handle card click
  const handleCardClick = (index: number) => {
    // Prevent clicks during match checking or on already flipped/matched cards
    if (isCheckingMatch || flippedIndices.includes(index) || cards[index].isMatched || flippedIndices.length >= 2) {
      return
    }

    // Flip the card
    const updatedCards = [...cards]
    updatedCards[index].isFlipped = true
    setCards(updatedCards)

    // Add to flipped indices
    const newFlippedIndices = [...flippedIndices, index]
    setFlippedIndices(newFlippedIndices)

    // Check for match if two cards are flipped
    if (newFlippedIndices.length === 2) {
      setIsCheckingMatch(true)
      setAttempts((prev) => prev + 1)

      const [firstIndex, secondIndex] = newFlippedIndices
      const firstCard = updatedCards[firstIndex]
      const secondCard = updatedCards[secondIndex]

      if (firstCard.characterId === secondCard.characterId) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...updatedCards]
          matchedCards[firstIndex].isMatched = true
          matchedCards[secondIndex].isMatched = true
          setCards(matchedCards)
          setFlippedIndices([])
          setMatchedPairs((prev) => prev + 1)
          setIsCheckingMatch(false)
          trackEvent("match_found", { characterId: firstCard.characterId })
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...updatedCards]
          resetCards[firstIndex].isFlipped = false
          resetCards[secondIndex].isFlipped = false
          setCards(resetCards)
          setFlippedIndices([])
          setIsCheckingMatch(false)
          trackEvent("no_match", { characterIds: [firstCard.characterId, secondCard.characterId] })
        }, 1000)
      }
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4">
      {/* Background with proper layering */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-teal-900 z-0" />
      <BackgroundEffect />

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-0"
        >
          <img
            className="w-full max-w-2xl mx-auto h-auto"
            src="/images/memory match.png"
            alt="Memory Match Logo"
            loading="eager"
            decoding="async"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 50vw"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <GameControls onNewGame={initializeGame} gameCompleted={gameCompleted} />
          <ScoreDisplay
            matches={matchedPairs}
            totalPairs={TOTAL_PAIRS}
            attempts={attempts}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full flex justify-center"
        >
          <CardGrid
            cards={cards}
            onCardClick={handleCardClick}
            characterImages={CHARACTER_IMAGES}
          />
        </motion.div>
      </div>

      <AudioButton audioUrl="/music/Rick and Morty Radio.mp3" />
      
      {/* Confetti effect */}
      <Confetti isActive={gameCompleted} />
      
      {/* Game complete popup */}
      <Popup
        isOpen={showPopup}
        onClose={handleClosePopup}
        attempts={attempts}
      />
    </div>
  )
}