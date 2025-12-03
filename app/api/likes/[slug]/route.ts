import { NextRequest, NextResponse } from "next/server"
import { getLikes, toggleLike, hasUserLiked, getClientHash, recordPopularityScore } from "@/lib/redis-features"
import { getViewCount } from "@/lib/cache"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

  try {
    const clientHash = await getClientHash()
    const [likes, liked] = await Promise.all([
      getLikes(slug),
      hasUserLiked(slug, clientHash)
    ])

    return NextResponse.json({ likes, liked })
  } catch (error) {
    console.error("Error getting likes:", error)
    return NextResponse.json({ likes: 0, liked: false })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

  try {
    const clientHash = await getClientHash()
    const result = await toggleLike(slug, clientHash)

    // Update popularity score
    const views = await getViewCount(slug)
    await recordPopularityScore(slug, views, result.likes)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ likes: 0, liked: false })
  }
}
