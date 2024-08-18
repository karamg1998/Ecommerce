import Header from "./Header";
import { useState } from "react";
import SuccessPop from "./SuccessPopup.js";
import FailPop from "./FailPopup.js";
import TextField from '@mui/material/TextField';
import { jwtDecode } from "jwt-decode";
import Button from '@mui/material/Button';
import axios from "axios";
import { toast } from "react-toastify";

export default function Addprod() {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState('');
    const [categ, setCateg] = useState('');
    let [success, setSuccess] = useState(false);
    let [fail, setFail] = useState(false);
    let [msg, setMsg] = useState('');
    let [user, setUser] = useState('');
    let u = JSON.parse(localStorage.getItem('user'));

    useState(() => {
        if (u) {
            setUser(u);
        }
    }, [])


    async function addProd() {
        if (!user) {
            setFail(true);
            setMsg('No user found')
            setTimeout(() => {
                setFail(false);
            }, 3000);
            return;
        }
        else {
            if (name.length < 5 || price.length < 1 || categ.length < 5 || image === null) {
                setFail(true);
                setMsg('All fields are mendatory!')
                setTimeout(() => {
                    setFail(false);
                }, 3000);
                return;
            }
            else {
                const formData = new FormData();
                formData.append('image', image);
                formData.append('name', name);
                formData.append('price', price);
                formData.append('category', categ);
                formData.append('user', user.id);

                await axios.post('http://localhost:4000/addProd', formData).then(data => {
                    if (data.data.status === 200) {
                        setSuccess(true);
                        toast(data.data.msg)
                        return;
                    }
                    else if (data.data.status === 201) {
                        setFail(true);
                        toast(data.data.msg)
                        return;
                    }
                    else {
                        setFail(true);
                        toast(data.data.msg)
                        return;
                    }
                });
            }

        }
    }


    return (
        <>
            <Header></Header>
            <div className="add-form">
                <TextField fullWidth id="outlined-basic" label="Name" variant="outlined" onChange={(e) => { setName(e.target.value) }} /><br></br><br></br><br></br>
                <TextField fullWidth type="file" name="myImage" id="outlined-basic" label="Image" variant="outlined" onChange={(e) => { setImage(e.target.files[0]) }} /><br></br><br></br><br></br>
                <TextField fullWidth type="number" id="outlined-basic" label="Price" variant="outlined" onChange={(e) => { setPrice(e.target.value) }} /><br></br><br></br><br></br>
                <TextField fullWidth id="outlined-basic" label="Category" variant="outlined" onChange={(e) => { setCateg(e.target.value) }} /><br></br><br></br><br></br>
                <Button size="small" sx={{ marginLeft: '40%' }} variant="outlined" className="add-pro" onClick={(e) => {
                    e.preventDefault();
                    addProd()
                }}>Add</Button>
            </div>
           {/*  {
                success && <SuccessPop msg={msg}></SuccessPop>
            }
            {
                fail && <FailPop msg={msg}></FailPop>
            } */}
        </>
    )
}