// middleware/caching.js
var client = require("../redis.js");

function cache(viewName, dataKey) {
  return async function (req, res, next) {
    try {
      const key = req.originalUrl; // e.g. "/hotels"
      const cached = await client.get(key);

      if (cached) {
        return res.render(viewName, {
          [dataKey]: JSON.parse(cached),
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

