import { Redis } from "@upstash/redis"

let redisClient: Redis | null = null

function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient
  }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return null
  }

  redisClient = new Redis({
    url,
    token,
  })

  return redisClient
}

export function getRedis(): Redis | null {
  return getRedisClient()
}

export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}
