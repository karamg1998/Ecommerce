const sequelize=require('../Database/db');
const Sequelize= require('sequelize');

const orders=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    amount:{
        type:Sequelize.FLOAT,
        allowNull:false,
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
});

module.exports=orders;