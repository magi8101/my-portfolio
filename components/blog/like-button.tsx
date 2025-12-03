"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"

interface LikeButtonProps {
  slug: string
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchLikes() {
      try {
        const response = await fetch(`/api/likes/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setLikes(data.likes)
          setLiked(data.liked)
        }
      } catch (error) {
        console.error("Error fetching likes:", error)
      }
    }

    fetchLikes()
  }, [slug])

  const handleLike = async () => {
    if (loading) return

    setLoading(true)
    try {
      const response = await fetch(`/api/likes/${slug}`, {
        method: "POST",
      })
      if (response.ok) {
        const data = await response.json()
        setLikes(data.likes)
        setLiked(data.liked)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 border transition-colors ${
        liked
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={liked ? "Unlike this post" : "Like this post"}
    >
      <Heart
        className={`w-4 h-4 transition-all ${liked ? "fill-primary" : ""}`}
      />
      <span className="text-sm font-mono">{likes}</span>
    </button>
  )
}
