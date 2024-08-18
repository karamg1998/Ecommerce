import { Height } from "@mui/icons-material";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FailPop from "./FailPopup";
import SuccessPop from "./SuccessPopup.js";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    let navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem('user'));
    let [success, setSuccess] = useState(false);
    let [fail, setFail] = useState(false);
    let [msg, setMsg] = useState('');
    let [prods, setProds] = useState([]);
    let [string, setString] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        else {
            fetch('http://localhost:4000/get-prod', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'user': user.id
                }
            }).then(p => {
                return p.json();
            }).then(data => {
                console.log(data)
                if (data.success === true) {
                    setProds(data.products);
                }
                else {
                    setFail(true);
                    setMsg(data.msg)
                    setTimeout(() => {
                        setFail(false);
                    }, 3000);
                }
            })
        }
    }, [])

    async function add(id) {
        try {
            await fetch('http://localhost:4000/addtocart', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prodId: id, id: user.id, quantity: 1 })
            }).then((r) => {
                return r.json();
            }).then((data) => {
                if (data.status === 200) {
                    toast(data.msg);
                }
                else {
                    toast(data.msg);
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    }

    async function buy(data) {
        await fetch('http://localhost:4000/make-1-Order', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'user': user.id
            },
            body: JSON.stringify({ prod: data })
        }).then((c) => {
            return c.json();
        }).then((data) => {
            toast(data.msg);
            console.log(data);
        })
    }


    const search = (data) => {
        setString(data);
    }


    return (
        <>
            <Header search={search} hide={false}></Header>
            <ImageList cols={3} sx={{ padding: "20px", marginLeft: '70px' }} >
                {prods.filter((item) => {
                    return item.name.toLowerCase().includes(string.toLocaleLowerCase());
                }).map((item, index) => {
                    console.log(item);
                   return (<div className="prod">
                        <img
                            src={`data:image/gif;base64,${item.image}`}
                            style={{ height: '200px', width: '300px', borderRadius: "6px" }}
                        /><br></br>
                        <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                        <span style={{ float: 'right', fontWeight: 'bold' }}>₹{item.price}</span><br></br><br></br>
                        <button className="buy" onClick={(e) => {
                            e.preventDefault();
                            buy(item);
                        }}>BUY NOW</button>
                        <button className="addtocart" onClick={(e) => {
                            e.preventDefault();
                            add(item.prodId);
                        }}>ADD TO CART</button>
                    </div>)
                })}
            </ImageList>
            <div>
                {
                    success && <SuccessPop msg={msg}></SuccessPop>
                }
                {
                    fail && <FailPop msg={msg}></FailPop>
                }
            </div>

        </>
    )
};