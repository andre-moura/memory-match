"use client"

import { Button } from "@/components/atoms/button"
import { Repeat } from "lucide-react"

interface GameControlsProps {
  onNewGame: () => void
  gameCompleted: boolean
}

export function GameControls({ onNewGame, gameCompleted }: GameControlsProps) {
  return (
    <Button
      onClick={onNewGame}
      className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white border-none shadow-lg shadow-purple-500/20 py-2 text-sm sm:text-base whitespace-nowrap"
    >
      <Repeat className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
      {gameCompleted ? "Play Again" : "New Game"}
    </Button>
  )
}