import 'server-only'

import Redis from 'ioredis'

// Create a singleton Redis instance
let redis: Redis | null = null

function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDISs_PORT ?? '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB ?? '0'),
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      reconnectOnError(err) {
        const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT']
        return targetErrors.some((targetError) =>
          err.message.includes(targetError)
        )
      },
    })

    // Event listeners for monitoring
    redis.on('connect', () => {
      console.log('Redis connected')
    })

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    redis.on('close', () => {
      console.log('Redis connection closed')
    })

    redis.on('reconnecting', () => {
      console.log('Redis reconnecting...')
    })

    redis.on('ready', () => {
      console.log('Redis ready to accept commands')
    })
  }

  return redis
}

// Export singleton instance
export default getRedisClient()

// Graceful shutdown
if (typeof window === 'undefined') {
  // Only run on server-side
  const cleanup = async () => {
    if (redis) {
      console.log('Redis connection...')
      await redis.quit()
      redis = null
    }
  }

  process.on('SIGTERM', cleanup)
  process.on('SIGINT', cleanup)
}
