"use client"

import { useRef, useState } from "react"

interface VideoBlockProps {
  src: string
  poster?: string
  caption?: string
}

export function VideoBlock({ src, poster, caption }: VideoBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <figure className="my-6 sm:my-8 -mx-4 sm:mx-0">
      <div className="relative group">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          className="w-full h-auto bg-card"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
        
        {!isPlaying && !videoRef.current?.currentTime && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-background/20 group-hover:bg-background/30 transition-colors"
            aria-label="Play video"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center border-2 border-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 ml-1"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}
      </div>
      
      {caption && (
        <figcaption className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 text-center px-4 sm:px-0">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
