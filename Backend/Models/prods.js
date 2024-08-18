const Sequelize = require('sequelize');
const sequelize =require('../Database/db');

const prods = sequelize.define('prods', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    category:{
      type : Sequelize.STRING(255),
      allowNull:false
    },
    image:{
      type:Sequelize.STRING(255),
      allowNull:false
    }
});

module.exports = prods;
