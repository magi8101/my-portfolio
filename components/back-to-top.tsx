"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowUp } from "lucide-react"

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 500)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-foreground text-background flex items-center justify-center hover:bg-primary transition-colors"
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  )
}
