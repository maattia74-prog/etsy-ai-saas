import { Redis } from '@upstash/redis';

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 3600
): Promise<RateLimitResult> {
  if (!redis) {
    // If Redis is not configured, allow all requests
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + windowSeconds * 1000,
    };
  }

  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  try {
    // Use Redis sorted set for sliding window
    const pipeline = redis.pipeline();
    
    // Remove old entries
    pipeline.zremrangebyscore(key, 0, windowStart);
    
    // Add current request
    pipeline.zadd(key, { score: now, member: `${now}:${Math.random()}` });
    
    // Count requests in window
    pipeline.zcard(key);
    
    // Set expiry
    pipeline.expire(key, windowSeconds);

    const results = await pipeline.exec();
    const count = results[2] as number;

    const success = count <= limit;
    const reset = now + windowSeconds * 1000;

    return {
      success,
      limit,
      remaining: Math.max(0, limit - count),
      reset,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open - allow the request
    return {
      success: true,
      limit,
      remaining: limit,
      reset: now + windowSeconds * 1000,
    };
  }
}

export async function checkQuota(
  userId: string,
  quotaUsed: number,
  quotaLimit: number
): Promise<boolean> {
  return quotaUsed < quotaLimit;
}
