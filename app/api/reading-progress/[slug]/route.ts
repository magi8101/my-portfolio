import { NextRequest, NextResponse } from "next/server"
import { getReadingProgress, saveReadingProgress, getClientHash } from "@/lib/redis-features"

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
    const progress = await getReadingProgress(slug, clientHash)

    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Error getting reading progress:", error)
    return NextResponse.json({ progress: 0 })
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
    const body = await request.json()
    const { progress } = body

    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return NextResponse.json({ error: "Invalid progress value" }, { status: 400 })
    }

    const clientHash = await getClientHash()
    await saveReadingProgress(slug, clientHash, progress)

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error("Error saving reading progress:", error)
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 })
  }
}
