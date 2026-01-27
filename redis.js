const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 200, 2000)
  }
});

redisClient.on('error', (err) => {
  console.log('Redis error:', err.message);
});

redisClient.connect()
  .then(() => console.log('Redis connected'))
  .catch(err => console.log('Redis connect failed:', err.message));

module.exports = redisClient;
