import { NextRequest, NextResponse } from "next/server"
import { updatePresence, getActiveReaders, getClientHash } from "@/lib/redis-features"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

  try {
    const count = await getActiveReaders(slug)
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error getting presence:", error)
    return NextResponse.json({ count: 0 })
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
    const count = await updatePresence(slug, clientHash)

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error updating presence:", error)
    return NextResponse.json({ count: 0 })
  }
}
