import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getClientHash } from "@/lib/redis-features"

export async function POST(request: NextRequest) {
  try {
    const clientHash = await getClientHash()
    const result = await checkRateLimit(`contact:${clientHash}`, 5, 3600) // 5 per hour

    if (!result.allowed) {
      return NextResponse.json(
        { 
          error: "Too many requests. Please try again later.",
          resetIn: result.resetIn 
        },
        { status: 429 }
      )
    }

    return NextResponse.json({
      allowed: true,
      remaining: result.remaining,
      resetIn: result.resetIn
    })
  } catch (error) {
    console.error("Rate limit check error:", error)
    return NextResponse.json({ allowed: true, remaining: 5, resetIn: 0 })
  }
}
