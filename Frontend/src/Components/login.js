import Header from "./Header";
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FailPop from "./FailPopup";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useEffect } from "react";


function Login() {
    let navigate = useNavigate();
    let [email, setEmail] = useState('');
    let [pass, setPass] = useState('');
    let [fail, setFail] = useState(false);
    let [msg, setMsg] = useState('');

    function Login(email, pass) {
        if (email.length < 5 || pass.length < 5) {
            setFail(true);
            setMsg('All the fields are mandatory!!');
            setTimeout(() => {
                setFail(false);
            }, 3000);
        }
        else {
            fetch('http://localhost:4000/login',
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Email': email,
                        'Pass': pass
                    }
                }
            ).then((res) => {
                return res.json();
            }).then(data => {
                if (data.success === true) {
                    localStorage.setItem('user', JSON.stringify(data))
                    navigate('/home')
                }
                else if (data.status === 201) {
                    setFail(true);
                    setMsg('Wrong password!!');
                    setTimeout(() => {
                        setFail(false);
                    }, 3000);
                }
                else {
                    setFail(true);
                    setMsg('No user present!!');
                    setTimeout(() => {
                        setFail(false);
                    }, 3000);
                }
            });
        }

    }

    return (
        <div>
            <Box sx={{ marginTop: '50px', marginLeft: '400px', marginRight: '400px' }}>
                <Card sx={{ textAlign: 'center' }}>
                    <CardContent>
                        <b>Welcome Back</b><br></br><br></br>
                        <TextField id="outlined-basic" label="Email" variant="outlined" onChange={(e) => { setEmail(e.target.value) }} /><br></br><br></br><br></br>
                        <TextField type="password" id="outlined-basic" label="Password" variant="outlined" onChange={(e) => { setPass(e.target.value) }} />
                    </CardContent>
                    <Box sx={{ marginLeft: '190px' }}>
                        <CardActions>
                            <Button size="small" variant="outlined" onClick={(e) => {
                                Login(email, pass);
                            }}>Login</Button>
                            <Link to='/signup'><Button size="small" variant="outlined">Sign Up</Button></Link>
                        </CardActions>
                        <div className="fp">
                            <Link to='/forgotPass'><button id="forgot">FORGOT PASSWORD</button></Link>
                        </div>

                    </Box>
                </Card>
            </Box>
            {
                fail && <FailPop msg={msg}></FailPop>
            }
        </div>
    )
}

export default Login;