const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const uuid = require('uuid')
const jwt = require('jsonwebtoken');
const users = require("../Models/users");
const forgots = require('../Models/forgots');
const cart = require('../Models/carts');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
});

function generateToken(id) {
    return jwt.sign(id, 'ghgsjhgjshgvb');
}

function verify(id) {
    return jwt.verify(id, 'ghgsjhgjshgvb')
}


exports.login = async (req, res) => {
    let email = req.header('email');
    let pass = req.header('pass');
    try {
        await users.findOne({ where: { email: email } }).then((user) => {
            if (user) {
                bcrypt.compare(pass, user.password, (err, response) => {
                    if (response === true) {
                        return res.json({ success: true, id: generateToken({ id: user.id, email: user.email, phone: user.phone, name: user.name, seller: user.seller }), status: 200 });
                    }
                    else {
                        return res.json({ success: false, msg: 'Password not match', status: 201 });
                    }
                })
            }
            else {
                return res.json({ success: false, msg: 'User not found', status: 404 })
            }
        })
    }
    catch (err) {
        console.log(err);
    }
};

exports.signup = async (req, res) => {
    try {
        bcrypt.hash(req.body.pass, 10, async (err, hash) => {
            try {
                let resp = await users.create({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hash,
                    seller: req.body.seller
                });

                if (resp) {
                    try {
                        await cart.create({
                            userId: resp.id
                        }).then((resp) => {
                            return res.status(200).json({ success: true, msg: 'user signed up', status: 200 })
                        })
                    }
                    catch (err) {
                        console.log(err, 'Error in creating cart')
                        return res.status(202).json({ success: false, msg: 'Error in creating cart', status: 202 })
                    }
                }
            }
            catch (err) {
                console.log(err, 'User already present')
                return res.status(202).json({ success: false, msg: 'User already present', status: 202 })
            }

        })
    }
    catch (err) {
        console.log(err, 'err')
        return res.status(202).json({ success: false, msg: 'Something went wrong', status: 203 })
    }
};

exports.forgot = async (req, res) => {
    let id = uuid.v4();
    try {
        users.findOne({ where: { email: req.body.email, phone: req.body.phone } })
            .then(async (re) => {
                if (re) {
                    await transporter.sendMail({
                        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
                        to: req.body.email,
                        subject: "Password reset link",
                        text: `http://localhost:3000/forgotPass/success?user=${generateToken(re.id)}&forgot=${id}`,
                        html: `<b>http://localhost:3000/forgotPass/success?user=${generateToken(re.id)}&forgot=${id}</b>`,
                    }).then(async (data) => {
                        console.log(id)
                        try {
                            await forgots.create({
                                id: id,
                                active: 'true',
                                userId: re.id
                            }).then((d) => {
                                return res.json({ success: true, status: 200, msg: 'Link sent to your mail', id: d.id })
                            })
                        }
                        catch (err) {
                            console.log(err);
                        }
                    })
                }
                else {
                    return res.json({ success: false, status: 404, msg: 'no user found' })
                }
            })
    }
    catch (err) {
        console.log(err);
    }
};

exports.forgotSuccess = async (req, res) => {
    try {
        await forgots.findOne({ where: { id: req.query.forgot, active: 'true', userId: verify(req.query.user) } })
            .then(async (data) => {
                try {
                    bcrypt.hash(req.header('pass'), 10, async (err, hash) => {
                        if (data) {
                            await users.update({ password: hash }, { where: { id: data.userId } })
                                .then((up) => {
                                    return data.update({ active: 'false' });
                                }).then((upd) => {
                                    return res.json({ status: 200, success: true, msg: 'Password is updated' })
                                })
                        }
                        else {
                            return res.json({ status: 419, success: false, msg: 'Link is expired' })
                        }
                    })
                }
                catch (err) {
                    console.log(err, 'bcrypt');
                }

            })

    }
    catch (err) {
        console.log(err, 'err');
    }
};