const Sequelize=require('sequelize');


let sequelize=new Sequelize('Ecommerce','root','Karamveer@123',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;