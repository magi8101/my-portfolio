import { createClient } from "@/lib/supabase/server"
import type { Post, PostInsert, PostUpdate } from "@/lib/supabase/types"

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  return data || []
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return data
}

export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  return data || []
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return data
}

export async function createPost(post: PostInsert): Promise<Post | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single()

  if (error) {
    console.error("Error creating post:", error)
    return null
  }

  return data
}

export async function updatePost(id: string, post: PostUpdate): Promise<Post | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("posts")
    .update({ ...post, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating post:", error)
    return null
  }

  return data
}

export async function deletePost(id: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting post:", error)
    return false
  }

  return true
}

export async function publishPost(id: string): Promise<Post | null> {
  return updatePost(id, {
    published: true,
    published_at: new Date().toISOString(),
  })
}

export async function unpublishPost(id: string): Promise<Post | null> {
  return updatePost(id, {
    published: false,
    published_at: null,
  })
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function extractPlainText(content: unknown): string {
  if (typeof content === "string") {
    return content.replace(/<[^>]*>/g, "")
  }
  
  if (typeof content === "object" && content !== null) {
    return JSON.stringify(content)
      .replace(/<[^>]*>/g, "")
      .replace(/[{}"[\]]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }
  
  return ""
}
