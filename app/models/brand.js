const {
  DataTypes,
  Model
} = require('sequelize');
const sequelize = require('../database');

class Brand extends Model {}

Brand.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    // on passe la propriété 'name' en contrainte d'unicité pour pouvoir s'en servir dans les url
    unique: true
  },
}, {
  sequelize,
  tableName: 'brand',
});

module.exports = Brand;