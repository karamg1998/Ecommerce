let express=require('express');
let sequelize=require('./Database/db');
let cors=require('cors');



let app=express();

let loginRoutes=require('./Routes/userRoutes');
let prodRoutes=require('./Routes/prodsRoutes');
let cartRoutes=require('./Routes/CartRoutes');
let orderRoutes=require('./Routes/orderRoutes')

let users=require("./Models/users");
let forgots=require("./Models/forgots");
let prods=require("./Models/prods");
let cart=require("./Models/carts");
let cartItems=require("./Models/cartItems");
const orders = require('./Models/Order');

users.hasMany(forgots);
users.hasMany(prods);
users.hasOne(cart);
cart.hasMany(cartItems);
prods.hasMany(cartItems);
users.hasMany(cartItems);
prods.hasMany(orders);
users.hasMany(orders);
cart.hasMany(orders);


app.use(express.json()); 
app.use(cors());
app.use(loginRoutes);
app.use(prodRoutes);
app.use(cartRoutes);
app.use(orderRoutes);


sequelize.sync().then(res => {
    app.listen(4000);
    console.log('listening at 4000')
  }).catch(err => console.log(err));