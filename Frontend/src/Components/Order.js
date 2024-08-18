import { useEffect, useState } from "react";
import Header from "./Header"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Order() {
    let user = JSON.parse(localStorage.getItem('user'));
    let navigate = useNavigate();
    let [prod, setProd] = useState([]);
    let [string, setString] = useState('');

    useEffect(() => {
        if (user) {
            fetch('http://localhost:4000/getorders', {
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
                    setProd(data.data);
                }
                else if (data.status === 202) {
                    setProd([]);
                }
                else {
                    setProd([]);
                    toast(data.msg);
                }
            })
        }
        else {
            navigate('/');
        }
    }, [])

    function amount() {
        let rupees = 0;
        prod.map((item) => {
            rupees = rupees + item.amount;
        })
        return rupees;
    }

    function formatISODateTime(isoDateString) {
        const date = new Date(isoDateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    const search = (data) => {
        setString(data);
    }

    return (
        <>
            <Header search={search} hide={false}></Header>
            <div className="cart-prod-container">
                {
                    prod.length === 0 && <h1>No orders...</h1> || <div>

                        <span style={{ fontWeight: 'bold', marginRight: '40%', fontSize: '18px' }}>Total Items: {prod.length}</span>
                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Total Amount: ₹{amount()}</span>

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
                                            <span style={{ marginLeft: '60px', fontWeight: 'bold' }} className="cart-price">₹{item.amount}</span>
                                            <span style={{ marginLeft: '60px', fontWeight: 'bold' }} className="cart-price">{formatISODateTime(item.dateTime)}</span>
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