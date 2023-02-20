const {
  Sequelize
} = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URL, {
  define: {
    underscored: true,
  },
  logging: false
});

sequelize.authenticate().then(() => {
  console.log('✅ CONNECTE A LA DB');
}).catch((err) => console.log("NON CONNECTE", err))

module.exports = sequelize;