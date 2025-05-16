"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CardProps {
  characterId: number
  characterImages: Array<{
    id: number
    name: string
    path: string
  }>
  index: number
  isFlipped: boolean
  isMatched: boolean
  onClick: () => void
}

export function Card({ characterId, characterImages, index, isFlipped, isMatched, onClick }: CardProps) {
  const character = characterImages.find(char => char.id === characterId)

  return (
    <motion.div
      className="relative w-full h-full perspective-1000"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: isFlipped || isMatched ? 1 : 1.05 }}
    >
      <motion.div
        className={cn(
          "absolute w-full h-full rounded-xl cursor-pointer preserve-3d transition-all duration-500",
          isFlipped || isMatched ? "rotate-y-180" : "",
        )}
        onClick={onClick}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden rounded-xl border-2 border-teal-400 bg-gradient-to-br from-purple-600 to-teal-400 shadow-lg shadow-purple-500/20 flex items-center justify-center">
          <div className="text-white text-4xl font-bold">?</div>
        </div>

        {/* Card Front */}
        <div
          className={cn(
            "absolute w-full h-full backface-hidden rotate-y-180 rounded-xl border-2 flex items-center justify-center overflow-hidden",
            isMatched
              ? "border-green-400 bg-gradient-to-br from-green-500 to-teal-400"
              : "border-yellow-400 bg-gradient-to-br from-yellow-500 to-teal-400",
          )}
        >
          {character && (
            <div className="w-full h-full p-2 flex items-center justify-center">
              <Image
                src={character.path}
                alt={character.name}
                width={120}
                height={120}
                className="object-contain rounded-lg"
                priority
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}