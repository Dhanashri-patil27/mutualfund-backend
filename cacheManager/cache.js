import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config(); 
const redis = new Redis(process.env.REDIS_URL, {
  tls: { rejectUnauthorized: false }
});

const CACHE_EXPIRY_TIME = 3600; // Cache expiry time in seconds (1 hour)

export class CacheManager {
  // Retrieve data from Redis cache
  static async getCache(cacheKey) {
    try {
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        console.log(" Cache hit:", cacheKey);
        return JSON.parse(cachedData);
      }

      console.log("❌ Cache miss:", cacheKey);
      return null;
    } catch (error) {
      console.error("❌ Error fetching cache from Redis:", error);
      return null;
    }
  }


  static async setCache(cacheKey, data) {
    try {
      await redis.setex(cacheKey, CACHE_EXPIRY_TIME, JSON.stringify(data));
      console.log(" Cache updated successfully:", cacheKey);
    } catch (error) {
      console.error(" Error setting cache in Redis:", error);
    }
  }

  // Clear specific cache key
  static async clearCache(cacheKey) {
    try {
      await redis.del(cacheKey);
      console.log(" Cache cleared:", cacheKey);
    } catch (error) {
      console.error(" Error clearing cache in Redis:", error);
    }
  }
}

export default redis; // Export Redis instance for global use
