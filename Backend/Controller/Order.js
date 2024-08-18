const { where } = require('sequelize');
let orders = require('../Models/Order');
let prods = require('../Models/prods')
let cartItems = require('../Models/cartItems');
let carts = require('../Models/carts');
let jwt = require('jsonwebtoken');
let fs = require('fs');

function verify(id) {
    return jwt.verify(id, 'ghgsjhgjshgvb')
}

async function read(name) {
    return new Promise((res, rej) => {
        fs.readFile(name, function (err, data) {
            res(data.toString('base64'));
        })
    })
};

function bulk(data, user) {
    let array = [];
    data.map((item) => {
        array.push({ quantity: item.quantity, amount: item.price, userId: user, prodId: verify(item.prod), cartId: verify(item.cart) })
    });
    return array;
}

exports.makeOrder = async (req, res) => {
    let userId = verify(req.header('user')).id;
    let products = req.body.prod;
    try {
        let data = bulk(products, userId);
        let bulkCreation = await orders.bulkCreate(data);
        if (bulkCreation) {
            try {
                await cartItems.destroy({ where: { userId: userId } })
                    .then((items) => {
                        return res.json({ status: 200, msg: 'Order placed' })
                    })
            }
            catch (err) {
                console.log(err, 'Error in deleting items');
                return res.json({ status: 206, msg: 'Error in deleting items' })
            }

        }
    }
    catch (err) {
        console.log(err, 'Error in creating bulk');
        return res.json({ status: 206, msg: "Error in bulk creation" })
    }
};

exports.getOrder = async (req, res) => {
    let user = verify(req.header('user')).id;
    try {
        let items = await orders.findAll({ where: { userId: user } });
        if (items.length !== 0) {
            try {
                let response = [];
                for (let i = 0; i < items.length; i++) {
                    let prod = await prods.findOne({ where: { id: items[i].prodId } });
                    let content = await read(`./images/${prod.image}`);
                    response.push({
                        name: prod.name, image: content, quantity: items[i].quantity, amount: items[i].amount,
                        price: prod.price, category: prod.category, dateTime: items[i].updatedAt
                    })
                }
                return res.json({ status: 200, data: response, msg: 'order sent' });
            }
            catch (err) {
                console.log(err, 'Error in getting prod');
                return res.json({ status: 206, msg: 'Error in getting prod' });
            }
        }
        else {
            console.log('no orders');
            return res.json({ status: 202, msg: 'No orders' });
        }
    }
    catch (err) {
        console.log(err, 'Error in getting orders');
        return res.json({ status: 206, msg: 'Error in getting orders' });
    }
};

exports.singleOrder = async (req, res) => {
    let user = verify(req.header('user')).id;
    try {
        let cart = await carts.findOne({ where: { userId: user } });
        if (cart) {
            try {
                await orders.create({
                    amount: req.body.prod.price,
                    quantity: 1,
                    prodId: verify(req.body.prod.prodId),
                    userId: user,
                    cartId: cart.id
                }).then((re)=>{
                    return res.json({ status: 200, msg: 'Oder placed' });
                })
            }
            catch (err) {
                console.log(err, 'Error in creating order');
                return res.json({ status: 206, msg: 'Error in creating order' });
            }

        }
        else {
            console.log('No cart');
            return res.json({ status: 202, msg: 'No cart' });
        }
    }
    catch (err) {
        console.log(err, 'Error in getting user');
        return res.json({ status: 206, msg: 'Error in getting user' });
    }
}