"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getPublishedPosts } from "@/lib/blog"

interface PopularPostsProps {
  currentSlug?: string
  limit?: number
  timeframe?: "all" | "week"
}

interface PostInfo {
  slug: string
  title: string
}

export function PopularPosts({ currentSlug, limit = 5, timeframe = "all" }: PopularPostsProps) {
  const [posts, setPosts] = useState<PostInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPopular() {
      try {
        const response = await fetch(`/api/popular?limit=${limit + 1}&timeframe=${timeframe}`)
        if (response.ok) {
          const data = await response.json()
          const slugs = (data.posts as string[]).filter(s => s !== currentSlug).slice(0, limit)
          
          if (slugs.length > 0) {
            // Fetch post titles
            const postsResponse = await fetch("/api/posts/by-slugs", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slugs }),
            })
            
            if (postsResponse.ok) {
              const postsData = await postsResponse.json()
              setPosts(postsData.posts)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching popular posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopular()
  }, [currentSlug, limit, timeframe])

  if (loading || posts.length === 0) {
    return null
  }

  return (
    <div className="border-t border-border pt-8 mt-12">
      <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
        {timeframe === "week" ? "Trending This Week" : "Popular Posts"}
      </h3>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-4 items-start"
          >
            <span className="text-2xl font-serif text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
