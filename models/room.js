module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    PricePerDay: DataTypes.DECIMAL(10, 2),
    Capacity: DataTypes.INTEGER,
    HotelId: DataTypes.INTEGER
  }, {
    tableName: 'rooms',        // 👈 important
    freezeTableName: true,     // 👈 important
    timestamps: false
  });

  Room.associate = function(models) {
    Room.belongsTo(models.Hotel, { foreignKey: 'HotelId' });
    Room.belongsToMany(models.User, { through: models.Reservation });
  };

  return Room;
};
