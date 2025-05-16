interface ScoreDisplayProps {
  matches: number
  totalPairs: number
  attempts: number
}

export function ScoreDisplay({ matches, totalPairs, attempts }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-6 bg-purple-900/30 backdrop-blur-sm rounded-xl px-6 py-2 text-white">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-teal-300">Matches:</span>
        <span className="text-lg font-bold">
          {matches}/{totalPairs}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-teal-300">Attempts:</span>
        <span className="text-lg font-bold">{attempts}</span>
      </div>
    </div>
  )
}
