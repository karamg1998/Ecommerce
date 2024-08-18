const prods = require('../Models/prods');
const users = require('../Models/users');
const cart = require('../Models/carts');
const cartitems = require('../Models/cartItems');
const jwt = require('jsonwebtoken');
const fs = require('fs');

function verify(id) {
    return jwt.verify(id, 'ghgsjhgjshgvb')
}

function generateToken(id) {
    return jwt.sign(id, 'ghgsjhgjshgvb');
}

async function read(name) {
    return new Promise((res, rej) => {
        fs.readFile(name, function (err, data) {
            res(data.toString('base64'));
        })
    })
};

exports.addtocart = async (req, res) => {
    let user = verify(req.body.id);
    let prod = verify(req.body.prodId);

    try {
        let User = await users.findOne({ where: { id: user.id, email: user.email, name: user.name, phone: user.phone } });
        if (User) {
            try {
                await cart.findOne({ where: { userId: User.id } }).then(async (c) => {
                    try {
                        let item = await cartitems.findOne({ where: { cartId: c.id, userId: user.id, prodId: prod } });
                        if (item) {
                            return res.json({ status: 204, msg: 'Item already added to cart' });
                        }
                        else {
                            try {
                                await cartitems.create({
                                    quantity: req.body.quantity,
                                    cartId: c.id,
                                    prodId: prod,
                                    userId: User.id
                                }).then((i) => {
                                    return res.json({ satus: 200, msg: 'Item added to cart' })
                                })
                            }
                            catch (err) {
                                console.log(err, 'Error in creating cart items');
                                return res.json({ status: 206, msg: 'Error in creating cart items' });
                            }
                        }
                    }
                    catch (err) {
                        console.log(err, 'Error in finding cart items');
                        return res.json({ status: 206, msg: 'Error in finding cart items' });
                    }
                })
            }
            catch (err) {
                console.log(err, 'Error in getting cart');
                return res.json({ status: 206, msg: 'Error in getting cart' });
            }
        }
        else {
            console.log('no user');
            return res.json({ status: 204, msg: 'No user found' })
        }
    }
    catch (err) {
        console.log(err, 'Error in getting user');
        return res.json({ status: 206, msg: 'Error in getting user' });
    }

};

exports.getCart = async (req, res) => {
    let user = verify(req.header('user'));
    try {
        let User = await users.findOne({ where: { id: user.id, email: user.email, name: user.name, phone: user.phone } });
        if (User) {
            try {
                let Cart = await cart.findOne({ where: { userId: User.id } });
                try {
                    if (Cart) {
                        await cartitems.findAll({ where: { cartId: Cart.id, userId: User.id } })
                            .then(async (items) => {
                                let array = [];
                                for (let i = 0; i < items.length; i++) {
                                    await prods.findOne({ where: { id: items[i].prodId } })
                                        .then(async (item) => {
                                            let content = await read(`./images/${item.image}`);
                                            let price = item.price * parseFloat(items[i].quantity);
                                            array.push({ name: item.name, image: content, price: price, category: item.category, quantity: items[i].quantity, originalPrice: item.price, prod: generateToken(item.id), cart: generateToken(Cart.id) });
                                        })
                                }
                                return res.json({ status: 200, cart: array });
                            })
                    }
                    else {
                        console.log(err, 'No cart found');
                        return res.json({ status: 204, msg: 'No cart found' });
                    }

                }
                catch (err) {
                    console.log(err, 'Error in getting cart');
                    return res.json({ status: 206, msg: 'Error in getting cart' });
                }
            }
            catch (err) {
                console.log(err, 'Error in getting cart');
                return res.json({ status: 206, msg: 'Error in getting cart' });
            }
        }
        else {
            console.log(err, 'No user');
            return res.json({ status: 204, msg: 'No user' });
        }
    }
    catch (err) {
        console.log(err, 'Error in getting user');
        return res.json({ status: 206, msg: 'Error in getting user' });
    }
}

exports.updateQuantity = async (req, res) => {
    let user = verify(req.header('user'));
    let prodId = verify(req.body.productId);
    let cartId = verify(req.body.cartId);
    let qty = req.body.quantity;
    try {
        await cartitems.update({ quantity: qty }, { where: { prodId: prodId, cartId: cartId } })
            .then(cartItems => {
                return res.json({ status: 200, mag: 'Updated' });
            })

    }
    catch (err) {
        console.log(err, 'Error in getting cart items');
        return res.json({ status: 206, msg: 'Error in getting cart items' })
    }
}

exports.remove = async (req, res) => {
    let user = verify(req.header('user'));
    let prodId = verify(req.body.productId);
    let cartId = verify(req.body.cartId);
    try {
        let content = await cartitems.destroy({ where: { userId: user.id, cartId: cartId, prodId: prodId } })
        if (content) {
            return res.json({ status: 200, msg: 'Item removed' });
        }
        else {
            return res.json({ status: 200, msg: 'Item not found' });
        }
    }
    catch (err) {
        console.log(err, 'Error in getting cartItems');
        return res.json({ status: 206, msg: 'Error in getting cartItems' });
    }
}