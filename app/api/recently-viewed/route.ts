import { NextRequest, NextResponse } from "next/server"
import { addRecentlyViewed, getRecentlyViewed, getClientHash } from "@/lib/redis-features"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get("limit") || "5", 10)

  try {
    const clientHash = await getClientHash()
    const slugs = await getRecentlyViewed(clientHash, limit)

    return NextResponse.json({ posts: slugs })
  } catch (error) {
    console.error("Error getting recently viewed:", error)
    return NextResponse.json({ posts: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug } = body

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const clientHash = await getClientHash()
    await addRecentlyViewed(clientHash, slug)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding recently viewed:", error)
    return NextResponse.json({ error: "Failed to add" }, { status: 500 })
  }
}
