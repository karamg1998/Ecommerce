import Header from "./Header";
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FailPop from "./FailPopup";
import SuccessPop from "./SuccessPopup.js";

function SignUp() {
    let navigate = useNavigate();
    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [phone, setPhone] = useState('');
    let [pass, setPass] = useState('');
    let [success, setSuccess] = useState(false);
    let [fail, setFail] = useState(false);
    let [msg, setMsg] = useState('');

    function signup(name, email, phone, pass, seller) {
        if (name.length < 5 || email.length < 5 || phone.length < 10 || pass.length < 5) {
            setFail(true);
            setMsg('All fields are mandatory!')
            setTimeout(() => {
                setFail(false);
            }, 3000);
        }
        else {
            fetch('http://localhost:4000/signup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name, email: email, phone: phone, pass: pass, seller: seller })
            }).then((res) => {
                return res.json();
            }).then(data => {
                console.log(data);
                if (data.success === true) {
                    setSuccess(true);
                    setMsg('User signed up');
                    setTimeout(() => {
                        setSuccess(false);
                        navigate('/')
                    }, 3000);
                }
                else if (data.status === 202) {
                    setFail(true);
                    setMsg('User already present');
                    setTimeout(() => {
                        setFail(false);
                    }, 3000);
                }
                else {
                    setFail(true);
                    setMsg('Something went wrong!!');
                    setTimeout(() => {
                        setFail(false);
                    }, 3000);
                }
            })
        }

    }


    return (
        <>
            <Box sx={{ marginLeft: '400px', marginRight: '400px', marginTop: '40px' }}>
                <Card sx={{ textAlign: 'center' }}>
                    <CardContent>
                        <b>New User</b><br></br><br></br>
                        <TextField id="outlined-basic" label="Name" variant="outlined" fullWidth onChange={(e) => { setName(e.target.value) }} /><br></br><br></br><br></br>
                        <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth onChange={(e) => { setEmail(e.target.value) }} /><br></br><br></br><br></br>
                        <TextField id="outlined-basic" label="Phone" variant="outlined" type="number" fullWidth onChange={(e) => { setPhone(e.target.value) }} /><br></br><br></br><br></br>
                        <TextField id="outlined-basic" label="Password" variant="outlined" type="password" fullWidth onChange={(e) => { setPass(e.target.value) }} />
                    </CardContent>
                    <Box sx={{ marginLeft: '100px' }}>
                        <CardActions>
                            <Button size="small" variant="outlined" onClick={(e) => { signup(name, email, phone, pass, 'false') }}>Sign Up</Button>
                            <Button size="small" variant="outlined" onClick={(e) => { signup(name, email, phone, pass, 'true') }}>Sign Up(seller)</Button>
                            <Link to='/'><Button size="small" variant="outlined">Already a user</Button></Link>
                        </CardActions>
                    </Box>
                </Card>
            </Box>
            {
                success && <SuccessPop msg={msg}></SuccessPop>
            }
            {
                fail && <FailPop msg={msg}></FailPop>
            }
        </>


    )
}

export default SignUp;