const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');
const Brand = require('./brand');

class Product extends Model {}

Product.init({
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
}, {
  sequelize,
  tableName: 'product',
});

module.exports = Product;
