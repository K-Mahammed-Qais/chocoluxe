const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_URI || 'mysql://root:root@127.0.0.1:3306/chocoluxe', {
  logging: false,
  dialect: 'mysql'
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected successfully.');
  } catch (error) {
    console.error('Unable to connect to MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };