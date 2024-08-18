const Sequelize = require('sequelize');
const sequelize = require('../Database/db');


const users = sequelize.define('users', {
  id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  email: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: "email"
  },
  phone: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: "phone"
  },
  password: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  seller: {
    type:Sequelize.STRING(255),
    allowNull:false
  }
});

module.exports=users;
