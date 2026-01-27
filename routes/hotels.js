var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var HotelService = require("../services/HotelService");
var db = require("../models");
var hotelService = new HotelService(db);
var { checkIfAuthorized, isAdmin } = require("./authMiddlewares");

var cache = require('../middleware/caching.js');
var client = require('../redis.js');

/* GET hotels listing */
router.get(
  '/',
  cache('hotels', 'hotels'),
  async function(req, res, next) {
    const hotels = await hotelService.get();
    await client.set(req.originalUrl, JSON.stringify(hotels));

    const username = req.user?.username ?? null0;
    res.render('hotels', { hotels: hotels, user: req.user, username: username });
  }
);

router.get('/:hotelId', async function(req, res, next) {
  const userId = req.user?.id ?? 0;
  const username = req.user?.username ?? null;
  const hotel = await hotelService.getHotelDetails(req.params.hotelId, userId);
  res.render('hotelDetails', { hotel, userId, user: req.user, username });
});

router.post('/', checkIfAuthorized, isAdmin, jsonParser, async function(req, res) {
  await hotelService.create(req.body.Name, req.body.Location);
  await client.del('/hotels'); // invalidate cache
  res.end();
});

router.delete('/:id', checkIfAuthorized, async function(req, res) {
  await hotelService.deleteHotel(req.params.id);
  await client.del('/hotels'); // invalidate cache
  res.end();
});

module.exports = router;
