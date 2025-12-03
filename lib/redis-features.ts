import { getRedis, isRedisConfigured } from "./redis"
import { headers } from "next/headers"
import crypto from "crypto"

// Key prefixes
const RATE_LIMIT_PREFIX = "rate:"
const LIKES_PREFIX = "likes:"
const USER_LIKES_PREFIX = "user_likes:"
const READING_PROGRESS_PREFIX = "reading:"
const POPULAR_PREFIX = "popular:"
const VISITORS_PREFIX = "visitors:"
const PRESENCE_PREFIX = "presence:"
const RECENTLY_VIEWED_PREFIX = "recent:"

// Rate Limiting
export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 3600
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  if (!isRedisConfigured()) {
    return { allowed: true, remaining: limit, resetIn: 0 }
  }

  const redis = getRedis()
  if (!redis) {
    return { allowed: true, remaining: limit, resetIn: 0 }
  }

  const key = `${RATE_LIMIT_PREFIX}${identifier}`

  try {
    const current = await redis.get<number>(key)
    const ttl = await redis.ttl(key)

    if (current === null) {
      await redis.set(key, 1, { ex: windowSeconds })
      return { allowed: true, remaining: limit - 1, resetIn: windowSeconds }
    }

    if (current >= limit) {
      return { allowed: false, remaining: 0, resetIn: ttl > 0 ? ttl : windowSeconds }
    }

    await redis.incr(key)
    return { allowed: true, remaining: limit - current - 1, resetIn: ttl > 0 ? ttl : windowSeconds }
  } catch (error) {
    console.error("Rate limit error:", error)
    return { allowed: true, remaining: limit, resetIn: 0 }
  }
}

// Get client IP hash for anonymous identification
export async function getClientHash(): Promise<string> {
  const headersList = await headers()
  const forwarded = headersList.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0].trim() : headersList.get("x-real-ip") || "unknown"
  return crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16)
}

// Like System
export async function getLikes(slug: string): Promise<number> {
  if (!isRedisConfigured()) {
    return 0
  }

  const redis = getRedis()
  if (!redis) {
    return 0
  }

  try {
    const likes = await redis.get<number>(`${LIKES_PREFIX}${slug}`)
    return likes || 0
  } catch (error) {
    console.error("Error getting likes:", error)
    return 0
  }
}

export async function toggleLike(
  slug: string,
  userHash: string
): Promise<{ likes: number; liked: boolean }> {
  if (!isRedisConfigured()) {
    return { likes: 0, liked: false }
  }

  const redis = getRedis()
  if (!redis) {
    return { likes: 0, liked: false }
  }

  const likesKey = `${LIKES_PREFIX}${slug}`
  const userLikesKey = `${USER_LIKES_PREFIX}${userHash}`

  try {
    const hasLiked = await redis.sismember(userLikesKey, slug)

    if (hasLiked) {
      await redis.srem(userLikesKey, slug)
      await redis.decr(likesKey)
      const likes = await redis.get<number>(likesKey)
      return { likes: Math.max(0, likes || 0), liked: false }
    } else {
      await redis.sadd(userLikesKey, slug)
      const likes = await redis.incr(likesKey)
      return { likes, liked: true }
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return { likes: 0, liked: false }
  }
}

export async function hasUserLiked(slug: string, userHash: string): Promise<boolean> {
  if (!isRedisConfigured()) {
    return false
  }

  const redis = getRedis()
  if (!redis) {
    return false
  }

  try {
    return await redis.sismember(`${USER_LIKES_PREFIX}${userHash}`, slug)
  } catch (error) {
    console.error("Error checking user like:", error)
    return false
  }
}

// Reading Progress
export async function saveReadingProgress(
  slug: string,
  userHash: string,
  progress: number
): Promise<void> {
  if (!isRedisConfigured()) {
    return
  }

  const redis = getRedis()
  if (!redis) {
    return
  }

  try {
    const key = `${READING_PROGRESS_PREFIX}${userHash}:${slug}`
    await redis.set(key, progress, { ex: 60 * 60 * 24 * 30 }) // 30 days
  } catch (error) {
    console.error("Error saving reading progress:", error)
  }
}

export async function getReadingProgress(slug: string, userHash: string): Promise<number> {
  if (!isRedisConfigured()) {
    return 0
  }

  const redis = getRedis()
  if (!redis) {
    return 0
  }

  try {
    const progress = await redis.get<number>(`${READING_PROGRESS_PREFIX}${userHash}:${slug}`)
    return progress || 0
  } catch (error) {
    console.error("Error getting reading progress:", error)
    return 0
  }
}

// Popular Posts (using sorted set)
export async function recordPopularityScore(slug: string, views: number, likes: number): Promise<void> {
  if (!isRedisConfigured()) {
    return
  }

  const redis = getRedis()
  if (!redis) {
    return
  }

  try {
    // Score = views + (likes * 5) for weighted popularity
    const score = views + likes * 5
    await redis.zadd(POPULAR_PREFIX + "all", { score, member: slug })
    
    // Weekly popularity (expires after 7 days)
    const weekKey = `${POPULAR_PREFIX}week:${getWeekKey()}`
    await redis.zadd(weekKey, { score, member: slug })
    await redis.expire(weekKey, 60 * 60 * 24 * 7)
  } catch (error) {
    console.error("Error recording popularity:", error)
  }
}

export async function getPopularPosts(limit: number = 5, timeframe: "all" | "week" = "all"): Promise<string[]> {
  if (!isRedisConfigured()) {
    return []
  }

  const redis = getRedis()
  if (!redis) {
    return []
  }

  try {
    const key = timeframe === "week" 
      ? `${POPULAR_PREFIX}week:${getWeekKey()}`
      : `${POPULAR_PREFIX}all`
    
    const results = await redis.zrange(key, 0, limit - 1, { rev: true })
    return results as string[]
  } catch (error) {
    console.error("Error getting popular posts:", error)
    return []
  }
}

function getWeekKey(): string {
  const now = new Date()
  const year = now.getFullYear()
  const week = Math.ceil((now.getDate() - now.getDay() + 1) / 7)
  return `${year}-${week}`
}

// Unique Visitors
export async function trackUniqueVisitor(userHash: string): Promise<{ total: number; isNew: boolean }> {
  if (!isRedisConfigured()) {
    return { total: 0, isNew: false }
  }

  const redis = getRedis()
  if (!redis) {
    return { total: 0, isNew: false }
  }

  try {
    const today = new Date().toISOString().split("T")[0]
    const dailyKey = `${VISITORS_PREFIX}daily:${today}`
    const totalKey = `${VISITORS_PREFIX}total`

    const wasAdded = await redis.sadd(dailyKey, userHash)
    await redis.expire(dailyKey, 60 * 60 * 24 * 2) // Keep for 2 days

    const isNew = wasAdded === 1

    if (isNew) {
      await redis.pfadd(totalKey, userHash)
    }

    const total = await redis.pfcount(totalKey)
    return { total, isNew }
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return { total: 0, isNew: false }
  }
}

export async function getTodayVisitors(): Promise<number> {
  if (!isRedisConfigured()) {
    return 0
  }

  const redis = getRedis()
  if (!redis) {
    return 0
  }

  try {
    const today = new Date().toISOString().split("T")[0]
    const count = await redis.scard(`${VISITORS_PREFIX}daily:${today}`)
    return count
  } catch (error) {
    console.error("Error getting today visitors:", error)
    return 0
  }
}

// Real-time Presence
export async function updatePresence(slug: string, userHash: string): Promise<number> {
  if (!isRedisConfigured()) {
    return 0
  }

  const redis = getRedis()
  if (!redis) {
    return 0
  }

  try {
    const key = `${PRESENCE_PREFIX}${slug}`
    const now = Date.now()
    
    // Add/update user presence with current timestamp as score
    await redis.zadd(key, { score: now, member: userHash })
    
    // Remove stale entries (older than 30 seconds)
    await redis.zremrangebyscore(key, 0, now - 30000)
    
    // Set expiry on the key
    await redis.expire(key, 60)
    
    // Count active readers
    const count = await redis.zcard(key)
    return count
  } catch (error) {
    console.error("Error updating presence:", error)
    return 0
  }
}

export async function getActiveReaders(slug: string): Promise<number> {
  if (!isRedisConfigured()) {
    return 0
  }

  const redis = getRedis()
  if (!redis) {
    return 0
  }

  try {
    const key = `${PRESENCE_PREFIX}${slug}`
    const now = Date.now()
    
    // Remove stale entries first
    await redis.zremrangebyscore(key, 0, now - 30000)
    
    return await redis.zcard(key)
  } catch (error) {
    console.error("Error getting active readers:", error)
    return 0
  }
}

// Recently Viewed Posts
export async function addRecentlyViewed(userHash: string, slug: string): Promise<void> {
  if (!isRedisConfigured()) {
    return
  }

  const redis = getRedis()
  if (!redis) {
    return
  }

  try {
    const key = `${RECENTLY_VIEWED_PREFIX}${userHash}`
    const now = Date.now()
    
    // Add with timestamp as score
    await redis.zadd(key, { score: now, member: slug })
    
    // Keep only last 10
    await redis.zremrangebyrank(key, 0, -11)
    
    // Expire after 30 days
    await redis.expire(key, 60 * 60 * 24 * 30)
  } catch (error) {
    console.error("Error adding recently viewed:", error)
  }
}

export async function getRecentlyViewed(userHash: string, limit: number = 5): Promise<string[]> {
  if (!isRedisConfigured()) {
    return []
  }

  const redis = getRedis()
  if (!redis) {
    return []
  }

  try {
    const results = await redis.zrange(`${RECENTLY_VIEWED_PREFIX}${userHash}`, 0, limit - 1, { rev: true })
    return results as string[]
  } catch (error) {
    console.error("Error getting recently viewed:", error)
    return []
  }
}

// Cache Post Data
export async function cachePostData<T>(slug: string, data: T, ttl: number = 3600): Promise<void> {
  if (!isRedisConfigured()) {
    return
  }

  const redis = getRedis()
  if (!redis) {
    return
  }

  try {
    await redis.set(`post:data:${slug}`, JSON.stringify(data), { ex: ttl })
  } catch (error) {
    console.error("Error caching post data:", error)
  }
}

export async function getCachedPostData<T>(slug: string): Promise<T | null> {
  if (!isRedisConfigured()) {
    return null
  }

  const redis = getRedis()
  if (!redis) {
    return null
  }

  try {
    const data = await redis.get<string>(`post:data:${slug}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error getting cached post data:", error)
    return null
  }
}
