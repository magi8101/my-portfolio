import { NextRequest, NextResponse } from "next/server"
import { getPopularPosts } from "@/lib/redis-features"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get("limit") || "5", 10)
  const timeframe = searchParams.get("timeframe") as "all" | "week" || "all"

  try {
    const slugs = await getPopularPosts(limit, timeframe)
    return NextResponse.json({ posts: slugs })
  } catch (error) {
    console.error("Error getting popular posts:", error)
    return NextResponse.json({ posts: [] })
  }
}
