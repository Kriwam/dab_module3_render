// services/HotelService.js
const { QueryTypes } = require("sequelize");

class HotelService {
  constructor(db) {
    this.client = db.sequelize; // use the SAME sequelize instance from db
  }

  // Create a hotel using raw SQL
  async create(name, location) {
    // ✅ await the query so it actually finishes before returning
    const result = await this.client.query(
      "INSERT INTO hotels (Name, Location) VALUES (:Name, :Location)",
      {
        replacements: { Name: name, Location: location },
      }
    );
    return result;
  }

  // Get all hotels using raw SQL
  async get() {
    const hotels = await this.client.query("SELECT * FROM hotels", {
      type: QueryTypes.SELECT,
    });
    return hotels;
  }

  // Get hotel details using raw SQL
  async getHotelDetails(hotelId, userId) {
    const hotel = await this.client.query(
      `SELECT h.id, h.Name, h.Location, ROUND(AVG(r.Value), 1) AS AvgRate
       FROM hotels h
       LEFT JOIN rates r ON h.id = r.HotelId
       WHERE h.id = :hotelId`,
      {
        replacements: { hotelId },
        type: QueryTypes.SELECT,
      }
    );

    const userRateCount = await this.client.query(
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
    const result = await this.client.query(
      "DELETE FROM hotels WHERE id = :hotelId",
      { replacements: { hotelId } }
    );
    return result;
  }

  // Rate a hotel using raw SQL
  async makeARate(userId, hotelId, value) {
    const result = await this.client.query(
      "INSERT INTO rates (Value, HotelId, UserId) VALUES (:value, :hotelId, :userId)",
      { replacements: { userId, hotelId, value } }
    );
    return result;
  }
}

module.exports = HotelService;
