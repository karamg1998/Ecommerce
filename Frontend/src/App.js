import Login from "./Components/login";
import SignUp from "./Components/Signup";
import Home from "./Components/Home";
import Forgot from "./Components/Forgot";
import ForgotSuccess from "./Components/ForgotSuccess";
import User from "./Components/User";
import AddProduct from "./Components/Add-product";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Cart from "./Components/Cart";
import Order from "./Components/Order";
import '../src/Components/alert.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Components/Header";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          <Route path="/home" element={<Home></Home>}></Route>
          <Route path="/forgotPass" element={<Forgot></Forgot>}></Route>
          <Route path="/forgotPass/success" element={<ForgotSuccess></ForgotSuccess>}></Route>
          <Route path="/home/user" element={<User></User>}></Route>
          <Route path="/add" element={<AddProduct></AddProduct>}></Route>
          <Route path="/cart" element={<Cart></Cart>}></Route>
          <Route path="/orders" element={<Order></Order>}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>

  )
};

export default App;