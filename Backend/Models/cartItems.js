const Sequelize = require('sequelize');
const sequelize =require('../Database/db');

const cartItems = sequelize.define('cartitems', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "Primary Key"
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
});

module.exports = cartItems;

