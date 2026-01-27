const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

class HotelService {
  constructor(db) {
    this.client = db?.sequelize; // optional, but keeping your pattern
  }

  // Create a hotel using raw SQL
  async create(name, location) {
    try {
      const result = await sequelize.query(
        "INSERT INTO hotels (Name, Location) VALUES (:Name, :Location)",
        {
          replacements: {
            Name: name,
            Location: location,
          },
          type: QueryTypes.INSERT,
        }
      );
      return result;
    } catch (err) {
      console.error("HotelService.create error:", err);
      throw err; // important so route can fail properly if needed
    }
  }

  // Get all hotels using raw SQL
  async get() {
    const hotels = await sequelize.query("SELECT * FROM hotels ORDER BY id ASC", {
      type: QueryTypes.SELECT,
    });
    return hotels;
  }

  // Get hotel details using raw SQL
  async getHotelDetails(hotelId, userId) {
    const hotel = await sequelize.query(
      `SELECT h.id, h.Name, h.Location, ROUND(AVG(r.Value), 1) AS AvgRate
       FROM hotels h
       LEFT JOIN rates r ON h.id = r.HotelId
       WHERE h.id = :hotelId`,
      {
        replacements: { hotelId },
        type: QueryTypes.SELECT,
      }
    );

    const userRateCount = await sequelize.query(
      "SELECT COUNT(*) as Rated FROM rates WHERE HotelId = :hotelId AND UserId = :userId;",
      {
        replacements: { hotelId, userId },
        type: QueryTypes.SELECT,
      }
    );

    hotel[0].Rated = userRateCount[0].Rated > 0;
    return hotel[0];
  }

  // Delete a hotel using raw SQL
  async deleteHotel(hotelId) {
    try {
      const result = await sequelize.query("DELETE FROM hotels WHERE id = :hotelId", {
        replacements: { hotelId },
        type: QueryTypes.DELETE,
      });
      return result;
    } catch (err) {
      console.error("HotelService.deleteHotel error:", err);
      throw err;
    }
  }

  // Rate a hotel using raw SQL
  async makeARate(userId, hotelId, value) {
    try {
      const result = await sequelize.query(
        "INSERT INTO rates (Value, HotelId, UserId) VALUES (:value, :hotelId, :userId)",
        {
          replacements: { userId, hotelId, value },
          type: QueryTypes.INSERT,
        }
      );
      return result;
    } catch (err) {
      console.error("HotelService.makeARate error:", err);
      throw err;
    }
  }
}

module.exports = HotelService;
