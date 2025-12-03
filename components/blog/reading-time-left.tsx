"use client"

import { useEffect, useState } from "react"

interface ReadingTimeLeftProps {
  readTime: number
}

export function ReadingTimeLeft({ readTime }: ReadingTimeLeftProps) {
  const [timeLeft, setTimeLeft] = useState(readTime)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / docHeight, 1)
      const remaining = Math.ceil(readTime * (1 - progress))
      setTimeLeft(Math.max(0, remaining))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [readTime])

  if (timeLeft === 0) {
    return <span className="text-primary">Finished</span>
  }

  return (
    <span>
      {timeLeft} min left
    </span>
  )
}
