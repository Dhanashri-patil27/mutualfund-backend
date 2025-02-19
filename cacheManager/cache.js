import Redis from 'ioredis';

const redis = new Redis(); 
const CACHE_EXPIRY_TIME = 3600; // Cache expiry time in seconds (1 hour)

export class CacheManager {
  static async getCache(cacheKey) {
    try {
      
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        console.log("Cache hit");
        return JSON.parse(cachedData); 
      }

      console.log("Cache miss");
      return null; 
    } catch (error) {
      console.error("Error fetching cache from Redis:", error);
      return null; 
    }
  }

  static async setCache(cacheKey, data) {
    try {
      
      await redis.setex(cacheKey, CACHE_EXPIRY_TIME, JSON.stringify(data)); 
      console.log("Cache updated successfully");
    } catch (error) {
      console.error("Error setting cache in Redis:", error);
    }
  }
}
