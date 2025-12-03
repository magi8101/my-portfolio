"use client"

import { useEffect, useState } from "react"

interface ViewCounterProps {
  slug: string
  trackView?: boolean
}

export function ViewCounter({ slug, trackView = false }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    async function fetchAndTrackViews() {
      try {
        if (trackView) {
          const response = await fetch(`/api/views/${slug}`, {
            method: "POST",
          })
          if (response.ok) {
            const data = await response.json()
            setViews(data.views)
          }
        } else {
          const response = await fetch(`/api/views/${slug}`)
          if (response.ok) {
            const data = await response.json()
            setViews(data.views)
          }
        }
      } catch (error) {
        console.error("Error fetching views:", error)
      }
    }

    fetchAndTrackViews()
  }, [slug, trackView])

  if (views === null) {
    return <span className="text-muted-foreground">---</span>
  }

  return (
    <span>
      {views.toLocaleString()} {views === 1 ? "view" : "views"}
    </span>
  )
}
