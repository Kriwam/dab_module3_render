// routes/hotels.js
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var HotelService = require("../services/HotelService");
var db = require("../models");
var hotelService = new HotelService(db);

var { checkIfAuthorized, isAdmin } = require("./authMiddlewares");

var cache = require("../middleware/caching.js");
var client = require("../redis.js");

/* GET hotels listing */
router.get("/", cache("hotels", "hotels"), async function (req, res, next) {
  try {
    const hotels = await hotelService.get();

    // cache uses req.originalUrl as key, for /hotels it is "/hotels"
    await client.set(req.originalUrl, JSON.stringify(hotels));

    const username = req.user?.username ?? null;
    res.render("hotels", { hotels: hotels, user: req.user, username: username });
  } catch (err) {
    next(err);
  }
});

router.get("/:hotelId", async function (req, res, next) {
  try {
    const userId = req.user?.id ?? 0;
    const username = req.user?.username ?? null;
    const hotel = await hotelService.getHotelDetails(req.params.hotelId, userId);
    res.render("hotelDetails", { hotel, userId, user: req.user, username });
  } catch (err) {
    next(err);
  }
});

router.post("/", checkIfAuthorized, isAdmin, jsonParser, async function (req, res, next) {
  try {
    const { Name, Location } = req.body;

    if (!Name || !Location) {
      return res.status(400).json({ message: "Name and Location are required" });
    }

    await hotelService.create(Name, Location);

    // ✅ invalidate the SAME key the cache middleware uses
    await client.del("/hotels");

    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", checkIfAuthorized, async function (req, res, next) {
  try {
    await hotelService.deleteHotel(req.params.id);

    await client.del("/hotels");

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
