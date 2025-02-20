import database from "../models/index.js"; // Import Sequelize DB
import { Op } from "sequelize"; // For expiry condition

const CACHE_EXPIRY_TIME = 3600 * 1000; // 1 hour in milliseconds
console.log("🚀 ~ CACHE_EXPIRY_TIME:", CACHE_EXPIRY_TIME)

class CacheManager {
  static async getCache(cacheKey) {
    try {
      console.log("🚀 ~ CacheManager ~ getCache ~  new Date():",  new Date())
      const dbCache = await database.cache.findOne({
        where: {
          key: cacheKey,
          expiresAt: { [Op.gt]: new Date() }, // Check if still valid
        },
      });

      if (dbCache) {
        console.log("Cache hit from DB");
        return dbCache.data;
      }

      console.log("Cache miss");
      return null;
    } catch (error) {
      console.error("Error fetching cache:", error);
      return null;
    }
  }

  static async setCache(cacheKey, data) {
    try {
      const expiresAt = new Date(Date.now() + CACHE_EXPIRY_TIME); // Expiry time
      console.log("🚀 ~ CacheManager ~ setCache ~ expiresAt:", expiresAt)

      await database.cache.upsert({
        key: cacheKey,
        data: data,
        expiresAt: expiresAt, // Set expiry
      });

      console.log("Cache set in PostgreSQL");
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  }

  static async deleteCache(cacheKey) {
    try {
      await database.cache.destroy({ where: { key: cacheKey } });
      console.log("Cache deleted from PostgreSQL");
    } catch (error) {
      console.error("Error deleting cache:", error);
    }
  }

  static async cleanExpiredCache() {
    try {
      await database.cache.destroy({
        where: { expiresAt: { [Op.lte]: new Date() } }, // Delete expired records
      });
      console.log("Expired cache cleaned");
    } catch (error) {
      console.error("Error cleaning expired cache:", error);
    }
  }
}

export default CacheManager;
