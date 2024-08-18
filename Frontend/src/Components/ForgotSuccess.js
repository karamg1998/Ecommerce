import { useState } from "react"
import { useParams, useSearchParams,useNavigate } from "react-router-dom";


export default function ForgotSuccess() {
    let [pass, setPass] = useState('');
    let [cnf, setCnf] = useState('');
    let [fail, setFail] = useState(false);
    let [msg, setMsg] = useState('');
    let [success, setSuccess] = useState(false);
    let [query, setQuery] = useSearchParams();
    let navigate=useNavigate();
 
    function reset() {

        if (pass.length < 5 || cnf.length < 5) {
            setFail(true);
            setMsg('All the fields are mandatory!!');
            setTimeout(() => {
                setFail(false);
            }, 3000);
        }
        else {

            if (pass === cnf) {
                console.log('hello')
                fetch(`http://localhost:4000/forgot/success?user=${query.get('user')}&forgot=${query.get('forgot')}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "pass": pass
                        },
                    }
                ).then(d => { 
                    return d.json() 
                }).then(c => {
                    if(c.status===200)
                    {
                        setSuccess(true);
                        setMsg('Password is changed');
                        setTimeout(() => {
                            navigate('/');
                            setSuccess(false);
                        }, 3000);
                    }
                    else if(c.status===419)
                    {
                        setFail(true);
                        setMsg('Link expired!!');
                        setTimeout(() => {
                            setFail(false);
                            navigate('/');
                        }, 3000);
                    }
                    else{
                        setFail(true);
                        setMsg('Something went wrong!!');
                        setTimeout(() => {
                            setFail(false);
                        }, 3000);
                    }
                })
            }
            else {
                setFail(true);
                setMsg(`Password doesn't match`);
                setTimeout(() => {
                    setFail(false);
                }, 3000);
            }
        }
    }

    return (
        <>
            <div className="forgotblock">
                <label className="phone">New password:</label>
                <input className='inEmail' type="password" onChange={(e) => { setPass(e.target.value) }}></input><br></br><br></br>
                <label className="phone">Confirm password:</label>
                <input className='inEmail' type="password" onChange={(e) => { setCnf(e.target.value) }}></input><br></br><br></br>
                <button className='SuccessForgot' onClick={(e) => { reset() }}>Reset</button>
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