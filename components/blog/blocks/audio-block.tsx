"use client"

import { useRef, useState, useEffect } from "react"

interface AudioBlockProps {
  src: string
  title?: string
  caption?: string
}

export function AudioBlock({ src, title, caption }: AudioBlockProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)
    
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <figure className="my-6 sm:my-8 -mx-4 sm:mx-0">
      <div className="bg-card border border-border p-4 sm:p-6">
        <audio ref={audioRef} src={src} preload="metadata">
          Your browser does not support the audio element.
        </audio>
        
        {title && (
          <div className="text-xs sm:text-sm font-mono text-muted-foreground mb-3 sm:mb-4 truncate">
            {title}
          </div>
        )}
        
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center border border-foreground hover:bg-foreground hover:text-background transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-foreground"
              aria-label="Seek audio"
            />
            <div className="flex justify-between text-[10px] sm:text-xs font-mono text-muted-foreground mt-1.5 sm:mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {caption && (
        <figcaption className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 text-center px-4 sm:px-0">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
