import { useState } from 'react';

export default function Forgot() {
    let [email, setEmail] = useState('');
    let [phone, setPhone] = useState('');
    let [success, setSuccess] = useState(false);
    let [fail, setFail] = useState(false);
    let [msg, setMsg] = useState('');
    let [loading,setLoading]=useState(false);


    function forgot() {
        if (email.length < 5 || phone.length < 5) {
            setFail(true);
            setMsg('All the fields are mandatory!!');
            setTimeout(() => {
                setFail(false);
            }, 3000);
        }
        else {
            setLoading(true);
            fetch('http://localhost:4000/forgot',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: email, phone: phone })
                }
            ).then((r) => {
                return r.json();
            }).then(data => {
                console.log(data);
                setLoading(false);
                if (data.status === 200) {
                    setSuccess(true);
                    setMsg('Reset link sent to your mail');
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                }
                else if (data.status === 404) {
                    setFail(true);
                    setMsg('No user found');
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
            <div className='forgotblock'>
                <label className='email'>Email:</label>
                <input className='inEmail' onChange={(e) => { setEmail(e.target.value) }}></input><br></br><br></br>
                <label className='phone'>Phone:</label>
                <input className='inPhone' onChange={(e) => { setPhone(e.target.value) }} type='number'></input><br></br><br></br>
                <button className='SuccessForgot' onClick={(e) => {
                    e.preventDefault();
                    forgot();
                }}>
                    {loading && <i class="fa fa-circle-o-notch fa-spin"></i> || <text>Send</text>}
                </button>
            </div>
            {success && <div className='alert'>
                <span>
                    {msg}
                </span>
            </div>}
            {
                fail && <div className='alert2'>
                    <span>
                        {msg}
                    </span>
                </div>
            }
        </>

    )
}