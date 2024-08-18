import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ReactComponent as Logo } from '../Logo/ecommerce-svgrepo-com.svg';
import { ReactComponent as Logout } from '../Logo/7124045_logout_icon.svg';
import { ReactComponent as User } from '../Logo/user-icon-svgrepo-com.svg';
import { ReactComponent as Add } from '../Logo/add.svg';
import { ReactComponent as Cart } from '../Logo/cart.svg';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { ReactComponent as Ord } from '../Logo/2639879_order_icon.svg';

function Header({ search, hide }) {
    let navigate = useNavigate();
    let u = JSON.parse(localStorage.getItem('user'));
    let [seller, setSeller] = React.useState({});
    let [hidden, setHidden] = React.useState(true)


    useEffect(() => {
        if (u) {
            let decode = jwtDecode(u.id);
            setSeller(decode);
            setHidden(hide);
        }
    }, [])


    function user() {
        navigate('/home/user')
    }

    function logout() {
        if (u.success === true) {
            localStorage.removeItem('user');
            navigate('/');
        }
    }

    return (
        <div className='main-h'>
            <Logo style={{ width: 120, height: 45, marginTop: '8px', cursor: 'pointer' }} onClick={(e) => {
                if (window.location.pathname !== '/home') {
                    navigate('/home');
                }
            }}></Logo>
            <div className='add-div'>
                <button className='user-b' onClick={(e) => {
                    e.preventDefault();
                    user()
                }}>
                    <User style={{ width: 40, height: 22 }}></User>
                </button>
                {seller.seller === 'true' && <button className='add-prod' onClick={(e) => {
                    e.preventDefault();
                    navigate('/add')
                }}>
                    <Add style={{ width: 40, height: 22 }}></Add>
                </button>}
                <button className='order' onClick={(e) => {
                    e.preventDefault();
                    navigate('/orders')
                }}><Ord style={{ width: 40, height: 22 }}></Ord></button>
                <button className='user-l' onClick={(e) => {
                    e.preventDefault();
                    navigate('/cart')
                }}>
                    <Cart style={{ width: 40, height: 22 }}></Cart>
                </button>
                <button className='user-l' onClick={(e) => {
                    e.preventDefault();
                    logout()
                }}>
                    <Logout style={{ width: 40, height: 22 }}></Logout>
                </button>
            </div>
            {hidden === false && <div className='search-div'>
                <input className='search-box' placeholder='Search products' onChange={(e) => {
                    search(e.target.value);
                }}></input>
            </div>}
        </div >)
}

export default Header;