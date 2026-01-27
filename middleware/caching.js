// Redis caching middleware
// NOTE: If views break or show wrong data, clear Redis keys (/hotels, /rooms)


var client = require('../redis.js');

function cache(viewName, dataKey) {
  return async function (req, res, next) {
    try {
      const key = req.originalUrl;
      const cached = await client.get(key);

      if (cached) {
        return res.render(viewName, {
          [dataKey]: JSON.parse(cached),

          // ✅ add these so EJS doesn't crash
          user: req.user ?? null,
          username: req.user?.username ?? 0,

          // keep these if other pages use them
          userId: req.user?.id ?? 0,
          isAdmin: req.user?.role === "Admin"
        });
      }

      next();
    } catch (err) {
      console.error(err);
      next();
    }
  };
}

module.exports = cache;


