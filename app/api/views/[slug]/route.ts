import { NextRequest, NextResponse } from "next/server"
import { getViewCount, incrementViewCount } from "@/lib/cache"
import { recordPopularityScore, addRecentlyViewed, getLikes, getClientHash } from "@/lib/redis-features"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

  const views = await getViewCount(slug)
  return NextResponse.json({ views })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

  const views = await incrementViewCount(slug)
  
  // Update popularity score and track recently viewed
  try {
    const [likes, clientHash] = await Promise.all([
      getLikes(slug),
      getClientHash()
    ])
    await Promise.all([
      recordPopularityScore(slug, views, likes),
      addRecentlyViewed(clientHash, slug)
    ])
  } catch (error) {
    console.error("Error updating popularity/recently viewed:", error)
  }

  return NextResponse.json({ views })
}
