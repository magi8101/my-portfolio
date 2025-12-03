import { getRedis, isRedisConfigured } from "./redis"

const DEFAULT_CACHE_TTL = 3600 // 1 hour in seconds
const VIEW_COUNT_KEY_PREFIX = "views:"
const POST_CACHE_KEY_PREFIX = "post:"
const POSTS_LIST_CACHE_KEY = "posts:published"

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_CACHE_TTL
): Promise<T> {
  if (!isRedisConfigured()) {
    return fetcher()
  }

  const redis = getRedis()
  if (!redis) {
    return fetcher()
  }

  try {
    const cached = await redis.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetcher()
    await redis.set(key, data, { ex: ttl })
    return data
  } catch (error) {
    console.error("Cache error:", error)
    return fetcher()
  }
}

export async function invalidateCache(key: string): Promise<void> {
  if (!isRedisConfigured()) {
    return
  }

  const redis = getRedis()
  if (!redis) {
    return
  }

  try {
    await redis.del(key)
  } catch (error) {
    console.error("Cache invalidation error:", error)
  }
}

export async function invalidatePostCaches(): Promise<void> {
  await invalidateCache(POSTS_LIST_CACHE_KEY)
}

export async function invalidatePostCache(slug: string): Promise<void> {
  await invalidateCache(`${POST_CACHE_KEY_PREFIX}${slug}`)
  await invalidateCache(POSTS_LIST_CACHE_KEY)
}

export async function getViewCount(slug: string): Promise<number> {
  if (!isRedisConfigured()) {
    return 0
  }

  const redis = getRedis()
  if (!redis) {
    return 0
  }

  try {
    const views = await redis.get<number>(`${VIEW_COUNT_KEY_PREFIX}${slug}`)
    return views || 0
  } catch (error) {
    console.error("Error getting view count:", error)
    return 0
  }
}

export async function incrementViewCount(slug: string): Promise<number> {
  if (!isRedisConfigured()) {
    return 0
  }

  const redis = getRedis()
  if (!redis) {
    return 0
  }

  try {
    const views = await redis.incr(`${VIEW_COUNT_KEY_PREFIX}${slug}`)
    return views
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return 0
  }
}

export function getPostCacheKey(slug: string): string {
  return `${POST_CACHE_KEY_PREFIX}${slug}`
}

export function getPostsListCacheKey(): string {
  return POSTS_LIST_CACHE_KEY
}
