import { NextRequest, NextResponse } from "next/server"
import { trackUniqueVisitor, getTodayVisitors, getClientHash } from "@/lib/redis-features"

export async function GET() {
  try {
    const today = await getTodayVisitors()
    return NextResponse.json({ today })
  } catch (error) {
    console.error("Error getting visitors:", error)
    return NextResponse.json({ today: 0 })
  }
}

export async function POST() {
  try {
    const clientHash = await getClientHash()
    const result = await trackUniqueVisitor(clientHash)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json({ total: 0, isNew: false })
  }
}
