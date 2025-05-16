"use client"

import { Card } from "@/components/atoms/card"

interface CardGridProps {
  cards: Array<{
    id: number
    characterId: number
    isFlipped: boolean
    isMatched: boolean
  }>
  onCardClick: (index: number) => void
  characterImages: Array<{
    id: number
    name: string
    path: string
  }>
}

export function CardGrid({ cards, onCardClick, characterImages }: CardGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
      {cards.map((card, index) => (
        <div key={index} className="aspect-square">
          <Card
            characterId={card.characterId}
            characterImages={characterImages}
            index={index}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => onCardClick(index)}
          />
        </div>
      ))}
    </div>
  )
}