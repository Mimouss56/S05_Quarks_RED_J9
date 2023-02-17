const {
    DataTypes,
    Model
} = require('sequelize');
const sequelize = require('../database');

class Category extends Model {}

Category.init({
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    }
}, {
    sequelize,
    tableName: 'category',
})

module.exports = Category;