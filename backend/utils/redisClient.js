// redisClient.js
import redis from 'redis';

import { createClient } from 'redis';

const client = createClient({
    password: 'PoROV1mpRPxBst0IFw6xncYCgUL6S7PF',
    socket: {
        host: 'redis-13570.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com',
        port: 13570
    }
});



client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});
await client.connect();
export default client;
