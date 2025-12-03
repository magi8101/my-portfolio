"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Post } from "@/lib/supabase/types"
import { createClient } from "@/lib/supabase/client"

interface PostActionsProps {
  post: Post
}

export function PostActions({ post }: PostActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePublishToggle = async () => {
    setLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("posts")
      .update({
        published: !post.published,
        published_at: !post.published ? new Date().toISOString() : null,
      })
      .eq("id", post.id)

    if (error) {
      console.error("Error updating post:", error)
    }
    
    setLoading(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id)

    if (error) {
      console.error("Error deleting post:", error)
      setLoading(false)
      return
    }
    
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-4">
      <Link
        href={`/admin/posts/${post.id}/edit`}
        className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handlePublishToggle}
        disabled={loading}
        className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        {post.published ? "Unpublish" : "Publish"}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-sm font-mono text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  )
}
