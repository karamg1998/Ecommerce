import Header from "./Header";
import * as React from 'react';
import SuccessPop from "./SuccessPopup.js";
import FailPop from "./FailPopup.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Up } from '../Logo/up-arrow-svgrepo-com.svg';
import { ReactComponent as Down } from '../Logo/down-arrow-svgrepo-com.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { increase, decrease, cart } from "../Redux/Slices/Quantity.js";

export default function Cart() {
    let navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem('user'));
    let [prod, setProd] = useState([]);
    let [success, setSuccess] = useState(false);
    let [fail, setFail] = useState(false);
    let [msg, setMsg] = useState('');
    let [string, setString] = useState('');


    useEffect(() => {
        if (user) {
            fetch('http://localhost:4000/getcart', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "user": user.id
                }
            }).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data);
                if (data.status === 200) {
                    setProd(data.cart);
                }
            })
        }
        else {
            navigate('/');
        }
    }, []);



    async function increase(index) {
        let temp = [...prod];
        if (temp[index].quantity > 0) {
            temp[index].quantity += 1;
            temp[index].price = temp[index].quantity * temp[index].originalPrice;
            setProd(temp);
            update(temp[index].prod, temp[index].cart, temp[index].quantity);
        }
    }

    async function decrease(index) {
        let temp = [...prod];
        if (temp[index].quantity === 1) {
            return;
        }
        else {
            temp[index].quantity -= 1;
            temp[index].price = temp[index].quantity * temp[index].originalPrice;
            setProd(temp);
            update(temp[index].prod, temp[index].cart, temp[index].quantity);
        }

    }

    async function update(prod, cart, quantity) {
        await fetch('http://localhost:4000/updateQty', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'user': user.id
            },
            body: JSON.stringify({ productId: prod, cartId: cart, quantity: quantity })
        }).then((c) => {
            return c.json();
        }).then((data) => {
            console.log(data);
            toast(data.mag);
        })
    }

    async function rem(ind, item) {
        await fetch('http://localhost:4000/removeItem', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'user': user.id
            },
            body: JSON.stringify({ productId: item.prod, cartId: item.cart })
        }).then((c) => {
            return c.json();
        }).then((data) => {
            console.log(data);
            toast(data.msg);
            if (data.status === 200) {
                let a = [...prod];
                a.splice(ind, 1);
                setProd(a);
            }
        })
    }

    function amount() {
        let rupees = 0;
        prod.map((item) => {
            rupees = rupees + (item.originalPrice * item.quantity);
        })
        return rupees;
    }

    async function buy() {
        await fetch('http://localhost:4000/makeOrder', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'user': user.id
            },
            body: JSON.stringify({ prod: prod })
        }).then((c) => {
            return c.json();
        }).then((data) => {
            if (data.status === 200) {
                setProd([]);
                toast(data.msg);
            }
            else {
                toast(data.msg);
            }
        })
    }

    const search = (data) => {
        setString(data);
    }

    return (
        <>
            <Header search={search} hide={false}></Header>
            <div className="cart-prod-container">
                {
                    prod.length === 0 && <h1>Cart is empty...</h1> || <div>

                        <span style={{ fontWeight: 'bold', marginRight: '40%', fontSize: '18px' }}>Total Items: {prod.length}</span>
                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Total Amount: ₹{amount()}</span>
                        {
                            prod.length !== 0 && <button className="buy" style={{ marginLeft: '20px' }} onClick={(e) => { buy(prod) }}>BUY ALL</button>
                        }

                        {

                            prod.filter((item) => {
                                return item.name.toLowerCase().includes(string.toLocaleLowerCase());
                            }).map((item, index) => {
                                return (
                                    <div className="cart-prod">
                                        <div className="cart-details">
                                            <img src={`data:image/gif;base64,${item.image}`}
                                                style={{ height: '100px', width: '200px', borderRadius: "6px" }} />
                                            <span style={{ marginLeft: '60px', fontWeight: 'bold' }} className="cart-name">{
                                                item.name.length <= 12 && item.name || `${item.name.slice(0, 12)}...`
                                            }</span>
                                            <span style={{ marginLeft: '60px', fontWeight: 'bold' }} className="cart-categ">{item.category}</span>
                                            <span style={{ marginLeft: '60px', fontWeight: 'bold' }} className="cart-quant">{item.quantity}</span>
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                increase(index);
                                            }} style={{ marginBottom: '80px', border: 'none', backgroundColor: "white", fontWeight: 'bold', marginTop: '4px', cursor: 'pointer' }}><Up style={{ height: '10px', width: '10px', }}></Up></button>
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                decrease(index);
                                            }} style={{ marginBottom: '80px', border: 'none', backgroundColor: "white", fontWeight: 'bold', marginTop: '4px', cursor: 'pointer' }}><Down style={{ height: '10px', width: '10px' }}></Down></button>
                                            <span style={{ marginLeft: '60px', fontWeight: 'bold' }} className="cart-price">₹{item.price}</span>
                                            <button className="rem" style={{ marginBottom: '80px', border: 'none', backgroundColor: "white", fontWeight: 'bold', marginTop: '4px', cursor: 'pointer', marginLeft: '50px', border: 'none', borderRadius: '4px', backgroundColor: 'red', padding: '4px' }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    rem(index, item);
                                                }}
                                            >Remove</button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }

            </div>
        </>
    )
};