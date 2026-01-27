const { createClient } = require("redis");

const buildRedisUrl = () => {
  // Prefer REDIS_URL if you have it (best)
  if (process.env.REDIS_URL) return process.env.REDIS_URL;

  // Otherwise build from separate env vars
  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT;
  const user = process.env.REDIS_USERNAME || "default";
  const pass = process.env.REDIS_PASSWORD;
  const tls = String(process.env.REDIS_TLS).toLowerCase() === "true";

  if (!host || !port || !pass) return null;

  const protocol = tls ? "rediss" : "redis";
  return `${protocol}://${encodeURIComponent(user)}:${encodeURIComponent(
    pass
  )}@${host}:${port}`;
};

const redisUrl = buildRedisUrl();

// ✅ If Redis is not configured, export null and don’t connect
if (!redisUrl) {
  console.warn("Redis not configured: missing REDIS_URL or REDIS_* variables");
  module.exports = null;
  return;
}

const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 200, 2000),
  },
});

// ✅ full error logging
redisClient.on("error", (err) => console.error("Redis error full:", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connect failed full:", err);
  }
})();

module.exports = redisClient;


