const Product = require('./product');
const Brand = require('./brand');
const Category = require('./category');

Product.belongsTo(Brand, {
  as: 'brand',
  foreignKey: 'brand_id',
});
Brand.hasMany(Product, {
  as: 'products',
  foreignKey: 'brand_id',
});

Category.belongsToMany(Product, {
  as: 'products',
  through: 'category_has_products',
  foreignKey: 'category_id',
  otherKey: 'product_id'
})
Product.belongsToMany(Category, {
  as: 'categories',
  through: 'category_has_products',
  otherKey: 'category_id',
  foreignKey: 'product_id'
})

module.exports = {
  Product,
  Brand,
  Category
}