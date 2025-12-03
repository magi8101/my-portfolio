"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Search, X } from "lucide-react"

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string | null
  tags: string[] | null
  published_at: string | null
  read_time: number | null
}

interface BlogSearchProps {
  posts: Post[]
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const [query, setQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [posts])

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesQuery =
        query === "" ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))

      const matchesTag = !selectedTag || post.tags?.includes(selectedTag)

      return matchesQuery && matchesTag
    })
  }, [posts, query, selectedTag])

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const hasFilters = query !== "" || selectedTag !== null

  return (
    <div className="mb-8 sm:mb-12">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search posts... (Ctrl+K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border border-border py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-mono text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 text-xs font-mono border transition-colors ${
              selectedTag === null
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1 text-xs font-mono border transition-colors ${
                selectedTag === tag
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {hasFilters && (
        <p className="text-sm text-muted-foreground mt-4">
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
        </p>
      )}

      {/* Filtered results */}
      {hasFilters && (
        <div className="space-y-0 border-t border-border mt-6">
          {filteredPosts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No posts found matching your search.</p>
            </div>
          ) : (
            filteredPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block py-6 sm:py-8 border-b border-border hover:border-primary transition-colors"
              >
                <div className="grid md:grid-cols-12 gap-3 sm:gap-4 md:gap-8 items-start">
                  <div className="hidden md:block md:col-span-1">
                    <span className="text-4xl font-serif text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="md:col-span-7">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground mt-2 sm:mt-3 line-clamp-2 text-sm sm:text-base">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-4 flex flex-wrap gap-3 sm:gap-4 md:justify-end items-start">
                    {post.published_at && (
                      <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                        {format(new Date(post.published_at), "MMM dd, yyyy")}
                      </span>
                    )}
                    {post.read_time && (
                      <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                        {post.read_time} min read
                      </span>
                    )}
                  </div>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 md:ml-[calc(8.333%+2rem)]">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 text-xs font-mono border ${
                          tag === selectedTag
                            ? "border-primary text-primary"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
