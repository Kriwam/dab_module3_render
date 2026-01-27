var client = require("../redis.js");

function cache(viewName, dataProp, cacheKey) {
  return async function (req, res, next) {
    try {
      const key = cacheKey || req.originalUrl;
      const cached = await client.get(key);

      if (cached) {
        return res.render(viewName, {
          [dataProp]: JSON.parse(cached),
          user: req.user ?? null,
          username: req.user?.username ?? null,
        });
      }

      next();
    } catch (err) {
      console.error("Cache middleware error:", err);
      next();
    }
  };
}

module.exports = cache;


