const Sequelize = require('sequelize');
const sequelize =require('../Database/db');

const forgots = sequelize.define('forgots', {
    id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    active: {
      type: Sequelize.STRING(255),
      allowNull: false
    }
});

module.exports = forgots;

