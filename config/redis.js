import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config(); 

const redis = new Redis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false } 
});

// Event listeners (optional for debugging)
redis.on('connect', () => console.log(' Connected to Upstash Redis'));
redis.on('error', (err) => console.error(' Redis error:', err));

export default redis;
