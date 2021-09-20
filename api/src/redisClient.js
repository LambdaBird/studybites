import redis from 'redis';
import { promisify } from 'util';

export const redisClient = redis.createClient({ host: 'redis', port: 6379 });

export const redisHgetAsync = promisify(redisClient.hgetall).bind(redisClient);
export const redisGetAsync = promisify(redisClient.get).bind(redisClient);
export const redisTtlAsync = promisify(redisClient.ttl).bind(redisClient);
