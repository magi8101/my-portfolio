"use client"

import { useEffect } from "react"

export function VisitorTracker() {
  useEffect(() => {
    async function trackVisitor() {
      try {
        await fetch("/api/visitors", { method: "POST" })
      } catch (error) {
        console.error("Error tracking visitor:", error)
      }
    }

    trackVisitor()
  }, [])

  return null
}
