import 'server-only'

import redis from './redis'

/**
 * Cache helper functions for common Redis operations
 */

export const cache = {
  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Redis GET error:', error)
      return null
    }
  },

  /**
   * Set a value in cache with optional TTL (in seconds)
   */
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value)
      if (ttl) {
        await redis.setex(key, ttl, serialized)
      } else {
        await redis.set(key, serialized)
      }
      return true
    } catch (error) {
      console.error('Redis SET error:', error)
      return false
    }
  },

  /**
   * Delete a key from cache
   */
  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error('Redis DEL error:', error)
      return false
    }
  },

  /**
   * Delete multiple keys matching a pattern
   */
  async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length === 0) return 0
      return await redis.del(...keys)
    } catch (error) {
      console.error('Redis DEL pattern error:', error)
      return 0
    }
  },

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      console.error('Redis EXISTS error:', error)
      return false
    }
  },

  /**
   * Get remaining TTL of a key (in seconds)
   */
  async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key)
    } catch (error) {
      console.error('Redis TTL error:', error)
      return -1
    }
  },

  /**
   * Increment a counter
   */
  async incr(key: string): Promise<number> {
    try {
      return await redis.incr(key)
    } catch (error) {
      console.error('Redis INCR error:', error)
      throw error
    }
  },

  /**
   * Set expiry on an existing key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await redis.expire(key, seconds)
      return result === 1
    } catch (error) {
      console.error('Redis EXPIRE error:', error)
      return false
    }
  },
}

/**
 * Rate limiting helper
 */
export async function rateLimit(
  identifier: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<{ success: boolean; remaining: number; reset: number }> {
  try {
    const key = `rate:${identifier}`
    const count = await redis.incr(key)

    if (count === 1) {
      await redis.expire(key, windowSeconds)
    }

    const ttl = await redis.ttl(key)
    const remaining = Math.max(0, limit - count)
    const success = count <= limit

    return {
      success,
      remaining,
      reset: Date.now() + ttl * 1000,
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    // Fail open - allow request if Redis is down
    return {
      success: true,
      remaining: limit,
      reset: Date.now() + windowSeconds * 1000,
    }
  }
}

/**
 * Session helpers
 */
export const session = {
  async get<T>(userId: string): Promise<T | null> {
    return cache.get<T>(`session:${userId}`)
  },

  async set(userId: string, data: any, ttl: number = 3600): Promise<boolean> {
    return cache.set(`session:${userId}`, data, ttl)
  },

  async delete(userId: string): Promise<boolean> {
    return cache.del(`session:${userId}`)
  },

  async exists(userId: string): Promise<boolean> {
    return cache.exists(`session:${userId}`)
  },
}

/**
 * Lock helper for distributed locking
 */
export async function acquireLock(
  lockKey: string,
  ttl: number = 10
): Promise<boolean> {
  try {
    const result = await redis.set(`lock:${lockKey}`, '1', 'EX', ttl, 'NX')
    return result === 'OK'
  } catch (error) {
    console.error('Acquire lock error:', error)
    return false
  }
}

export async function releaseLock(lockKey: string): Promise<boolean> {
  return cache.del(`lock:${lockKey}`)
}
