"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Volume1 } from "lucide-react"
import { Button } from "@/components/atoms/button"

interface AudioButtonProps {
  audioUrl: string
}

export function AudioButton({ audioUrl }: AudioButtonProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(0.5)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(audioUrl)
    audioRef.current.loop = true
    audioRef.current.volume = volume

    const audio = audioRef.current
    const handleLoadedMetadata = () => setDuration(audio.duration)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.pause()
      audioRef.current = null
    }
  }, [audioUrl, volume])

  useEffect(() => {
    if (!audioRef.current) return
    if (isMuted || volume === 0) {
      audioRef.current.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    } else {
      audioRef.current.play().catch(console.error)
      intervalRef.current = window.setInterval(() => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
      }, 100)
    }
  }, [isMuted, volume])

  const toggleMute = () => setIsMuted(!isMuted)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) audioRef.current.volume = newVolume
    if (newVolume === 0 && !isMuted) setIsMuted(true)
    else if (newVolume > 0 && isMuted) setIsMuted(false)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-5 w-5" />
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />
    return <Volume2 className="h-5 w-5" />
  }

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
    }, 200) // delay prevents flicker
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex flex-col items-end"
      >
        {/* Tooltip Panel */}
        <div
          className={`
            absolute right-0 bottom-[calc(100%+8px)]
            bg-purple-900/90 rounded-2xl shadow-xl shadow-purple-500/30 border border-teal-400/50
            transition-opacity duration-200
            ${isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
          style={{ width: '280px', padding: '16px' }}
        >
          {/* Volume Control */}
          <div className="flex items-center gap-3 mb-4">
            <Volume1 className="h-4 w-4 text-teal-400" />
            <input
              type="range"
              value={volume}
              onChange={handleVolumeChange}
              min="0"
              max="1"
              step="0.01"
              className="flex-1 h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <span className="text-white text-sm w-12 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Time Control */}
          <div className="flex items-center gap-3">
            <span className="text-white text-sm w-12">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              value={currentTime}
              onChange={handleTimeChange}
              min="0"
              max={duration}
              step="0.1"
              disabled={duration === 0}
              className="flex-1 h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer slider-thumb disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-white text-sm w-12 text-right">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Mute Button */}
        <Button
          onClick={toggleMute}
          variant="outline"
          size="icon"
          className="rounded-full bg-purple-900/70 hover:bg-purple-800 border-teal-400 text-white shadow-lg shadow-purple-500/20"
        >
          {getVolumeIcon()}
          <span className="sr-only">{isMuted ? "Unmute" : "Mute"} background music</span>
        </Button>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #14b8a6;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: #5eead4;
        }

        .slider-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #14b8a6;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          background: #5eead4;
        }

        .slider-thumb::-webkit-slider-runnable-track {
          background: transparent;
        }

        .slider-thumb::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  )
}
