"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"

interface ActiveReadersProps {
  slug: string
}

export function ActiveReaders({ slug }: ActiveReadersProps) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    async function updatePresence() {
      try {
        const response = await fetch(`/api/presence/${slug}`, {
          method: "POST",
        })
        if (response.ok) {
          const data = await response.json()
          setCount(data.count)
        }
      } catch (error) {
        console.error("Error updating presence:", error)
      }
    }

    // Initial update
    updatePresence()

    // Update every 15 seconds
    intervalId = setInterval(updatePresence, 15000)

    return () => {
      clearInterval(intervalId)
    }
  }, [slug])

  if (count === null || count <= 1) {
    return null
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <Users className="w-3.5 h-3.5" />
      <span>{count} reading now</span>
    </span>
  )
}
