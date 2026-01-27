module.exports = (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    Name: DataTypes.STRING,
    Location: DataTypes.STRING
  }, {
    tableName: 'hotels',
    freezeTableName: true,
    timestamps: true
  });

  Hotel.associate = function(models) {
    Hotel.hasMany(models.Room, { foreignKey: 'HotelId' });
    Hotel.belongsToMany(models.User, { through: models.Rate });
  };

  return Hotel;
};
