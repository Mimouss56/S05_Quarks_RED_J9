const {
  Sequelize
} = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URL, {
  define: {
    underscored: true,
  }
});

sequelize.authenticate().then(() => {
  console.log('✅ CONNECTE A LA DB');
})

module.exports = sequelize;