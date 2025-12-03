import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slugs } = body

    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json({ posts: [] })
    }

    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("posts")
      .select("slug, title")
      .in("slug", slugs)
      .eq("published", true)

    if (error) {
      console.error("Error fetching posts by slugs:", error)
      return NextResponse.json({ posts: [] })
    }

    // Maintain the order of the input slugs
    const postsMap = new Map(data?.map(p => [p.slug, p]) || [])
    const orderedPosts = slugs
      .map(slug => postsMap.get(slug))
      .filter(Boolean)

    return NextResponse.json({ posts: orderedPosts })
  } catch (error) {
    console.error("Error in posts/by-slugs:", error)
    return NextResponse.json({ posts: [] })
  }
}
