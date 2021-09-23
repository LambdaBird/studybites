import Redis from 'ioredis';

const PORT = process.env.REDIS_PORT || 6379;

export const redisClient = new Redis({ host: 'redis', port: PORT });
