"use client"

import { useEffect, useState, useCallback } from "react"

interface ReadingProgressProps {
  slug: string
}

export function ReadingProgress({ slug }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [savedProgress, setSavedProgress] = useState(0)
  const [showResume, setShowResume] = useState(false)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch(`/api/reading-progress/${slug}`)
        if (response.ok) {
          const data = await response.json()
          if (data.progress > 10 && data.progress < 90) {
            setSavedProgress(data.progress)
            setShowResume(true)
          }
        }
      } catch (error) {
        console.error("Error fetching progress:", error)
      }
    }

    fetchProgress()
  }, [slug])

  const saveProgress = useCallback(async (currentProgress: number) => {
    try {
      await fetch(`/api/reading-progress/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: currentProgress }),
      })
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }, [slug])

  useEffect(() => {
    let lastSaved = 0

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = Math.round((scrollTop / docHeight) * 100)
      
      setProgress(currentProgress)

      // Save every 10% progress
      if (Math.abs(currentProgress - lastSaved) >= 10) {
        lastSaved = currentProgress
        saveProgress(currentProgress)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Save on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (progress > 0) {
        saveProgress(progress)
      }
    }
  }, [progress, saveProgress])

  const handleResume = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollTo = (savedProgress / 100) * docHeight
    window.scrollTo({ top: scrollTo, behavior: "smooth" })
    setShowResume(false)
  }

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-border">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Resume reading prompt */}
      {showResume && (
        <div className="fixed bottom-6 right-6 z-50 bg-background border border-border p-4 shadow-lg max-w-xs">
          <p className="text-sm text-foreground mb-3">
            Continue where you left off? ({savedProgress}% read)
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleResume}
              className="px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Resume
            </button>
            <button
              onClick={() => setShowResume(false)}
              className="px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  )
}
