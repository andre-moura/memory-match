import { motion } from "framer-motion"
import { X } from "lucide-react"

interface GameCompletePopupProps {
  isOpen: boolean
  onClose: () => void
  attempts: number
}

export function Popup({ isOpen, onClose, attempts }: GameCompletePopupProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop as a flex container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      />

      {/* Popup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="fixed z-50 w-full max-w-md p-6 bg-gradient-to-br from-purple-900 via-purple-800 to-teal-900 rounded-2xl shadow-2xl border-2 border-green-400/50"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Wubba Lubba Dub Dub!
          </h2>

          <div className="text-xl text-green-400">
            Game Complete!
          </div>

          <p className="text-lg text-white/90">
            You found all matches in <span className="font-bold text-yellow-400">{attempts}</span> attempts
          </p>

          <div className="pt-4">
            <img 
              src="/images/Rick and Morty.png" 
              alt="Rick celebrating" 
            />
          </div>

          <button
            onClick={onClose}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors transform hover:scale-105"
          >
            Sweet!
          </button>
        </div>
      </motion.div>
    </>
  )
}
