const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class User extends Model {}

User.init({
  email: {
    type: DataTypes.TEXT,
    allowNull: false, 
    unique : true
  }, 
  password : {
    type : DataTypes.TEXT,
    allowNull : false,
  },
  username : {
    type : DataTypes.TEXT,
    allowNull : false,
  }
}, {
  sequelize,
  tableName: 'user',
});

module.exports = User;