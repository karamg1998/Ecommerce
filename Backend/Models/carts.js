const Sequelize = require('sequelize');
const sequelize =require('../Database/db');

const carts = sequelize.define('carts', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "Primary Key"
    }
  });

  module.exports = carts;
