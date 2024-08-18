const prods = require('../Models/prods');
const users = require('../Models/users');
const jwt = require('jsonwebtoken');
const { readFile } = require('node:fs/promises');
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

exports.Addprod = async (req, res) => {
    try {
        let user = await users.findOne({ where: { id: verify(req.body.user).id } });
        if (user) {
            if (user.seller === 'true' && user.name === verify(req.body.user).name) {
                await prods.create({
                    name: req.body.name,
                    image: req.file.filename,
                    price: req.body.price,
                    category: req.body.category,
                    userId: user.id
                }).then(prod => {
                    return res.status(200).json({ success: true, msg: 'product added', status: 200 });
                })
            }
            else {
                return res.status(201).json({ statua: 201, success: false, msg: 'User not authorized' });
            }
        }
        else {
            return res.status(201).json({ statua: 201, success: false, msg: 'No user' });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(202).json({ statua: 202, success: false, msg: 'Error in adding product' });
    }
};

exports.getProd = async (req, res) => {
    let logger = verify(req.header('user'));
    try {
        let user = await users.findOne({ where: { id: logger.id, name: logger.name, email: logger.email, phone: logger.phone } });
        if (user) {
            await prods.findAll().then(async prod => {
                let array = [];
                for (let i = 0; i < prod.length; i++) {
                    let content = await read(`./images/${prod[i].image}`);
                    array.push({ name: prod[i].name, image: content, price: prod[i].price, category: prod[i].category, prodId: generateToken(prod[i].id) });
                }
                return res.status(200).json({ status: 200, success: true, products: array });
            })
        }
        else {
            return res.status(201).json({ statua: 201, success: false, msg: 'No user' });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(202).json({ statua: 202, success: false, msg: 'Error in getting product' });
    }
};