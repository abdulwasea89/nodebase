import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    console.warn("REDIS_URL is not set");
}

// Create a Redis client instance
const redis = new Redis(redisUrl || "redis://localhost:6379");

export default redis;
