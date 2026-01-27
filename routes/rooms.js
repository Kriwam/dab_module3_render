var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var RoomService = require("../services/RoomService");
var db = require("../models");
var roomService = new RoomService(db);
var { checkIfAuthorized } = require("./authMiddlewares");

var cache = require('../middleware/caching.js');
var client = require('../redis.js');

router.get(
  '/',
  cache('rooms', 'rooms'),
  async function(req, res) {
    const rooms = await roomService.get();
    await client.set(req.originalUrl, JSON.stringify(rooms));

    res.render('rooms', {
      rooms,
      userId: req.user?.id ?? 0,
      username: req.user?.username ?? null,
      isAdmin: req.user?.role === "Admin"
    });
  }
);

router.get(
  '/:hotelId',
  cache('rooms', 'rooms'),
  async function(req, res) {
    const rooms = await roomService.getHotelRooms(req.params.hotelId);
    await client.set(req.originalUrl, JSON.stringify(rooms));

    res.render('rooms', {
      rooms,
      userId: req.user?.id ?? 0,
      username: req.user?.username ?? null,
      isAdmin: req.user?.role === "Admin"
    });
  }
);

router.post('/', checkIfAuthorized, jsonParser, async function(req, res) {
  await roomService.create(
    req.body.Capacity,
    req.body.PricePerDay,
    req.body.HotelId
  );

  await client.del('/rooms');
  await client.del(`/rooms/${req.body.HotelId}`);

  res.end();
});

router.post('/reservation', checkIfAuthorized, jsonParser, async function(req, res) {
  await roomService.rentARoom(
    req.body.UserId,
    req.body.RoomId,
    req.body.StartDate,
    req.body.EndDate
  );

  await client.del('/rooms');
  res.end();
});

router.delete('/', checkIfAuthorized, jsonParser, async function(req, res) {
  await roomService.deleteRoom(req.body.id);
  await client.del('/rooms');
  res.end();
});

module.exports = router;
