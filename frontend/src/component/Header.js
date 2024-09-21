import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assest/logo.png";
import { HiOutlineUserCircle } from "react-icons/hi";
import { BsCartFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { logoutRedux } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import { createSlice } from '@reduxjs/toolkit';


const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useSelector((state) => state.user);
  console.log(userData.email)
  const dispatch = useDispatch();

  const handleShowMenu = () => {
    setShowMenu((preve) => !preve);
  };
  const handleLogout = () => {
    dispatch(logoutRedux());
    toast("Logout successfully");
  };
  // In your userSlice.js
const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    firstName: null,
    image: null,
    // other user properties
  },
  reducers: {
    loginRedux: (state, action) => {
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.image = action.payload.image;
      // Set other user properties
    },
    logoutRedux: (state) => {
      state.email = null;
      state.firstName = null;
      state.image = null;
      // Reset other user properties
    },
  },
});
  const cartItemNumber = useSelector((state)=>state.product.cartItem)
  return (
    <header className="fixed shadow-md w-full h-16 px-2 md:px-4 z-50 bg-white">
      {/* desktop */}

      <div className="flex items-center h-full justify-between">
        <Link to={""}>
          <div className="h-10">
            <img src={logo} className="h-full" />
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-7">
          <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
            <Link to={""}>Home</Link>
            <Link to={"menu/63f0fdbb3bcc2f97fa53d25d"}>Menu</Link>
            <Link to={"about"}>About</Link>
            <Link to={"contact"}>Contact</Link>
          </nav>
          <div className="text-2xl text-slate-600 relative">
            <Link to={"cart"}>
              <BsCartFill />
              <div className="absolute -top-1 -right-1 text-white bg-red-500 h-4 w-4 rounded-full m-0 p-0 text-sm text-center ">
                {cartItemNumber.length}
              </div>
            </Link>
          </div>
          <div className="text-slate-600" onClick={handleShowMenu}>
  <div className="text-3xl cursor-pointer w-8 h-8 rounded-full overflow-hidden drop-shadow-md">
    {userData.image ? (
      <img src={userData.image} className="h-full w-full" alt="User" />
    ) : (
      <HiOutlineUserCircle />
    )}
  </div>
  {showMenu && (
    <div className="absolute right-2 bg-white py-2 shadow drop-shadow-md flex flex-col min-w-[120px] text-center">
      {userData.email ? (
        <>
          <p className="px-2 py-1 text-sm font-semibold">{userData.email}</p>
          <hr className="my-1" />
          <p
            className="cursor-pointer text-white px-2 py-1 bg-red-500 hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </p>
        </>
      ) : (
        <Link
          to={"login"}
          className="whitespace-nowrap cursor-pointer px-2 py-1 hover:bg-gray-100"
        >
          Login
        </Link>
      )}
      {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
        <Link
          to={"newproduct"}
          className="whitespace-nowrap cursor-pointer px-2 py-1 hover:bg-gray-100"
        >
          New product
        </Link>
        
      )}
      {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
        <Link
          to={"ProductList"}
          className="whitespace-nowrap cursor-pointer px-2 py-1 hover:bg-gray-100"
        >
          Product List
        </Link>
        
      )}

      <nav className="text-base md:text-lg flex flex-col md:hidden">
        <Link to={""} className="px-2 py-1 hover:bg-gray-100">
          Home
        </Link>
        <Link
          to={"menu/63f0fdbb3bcc2f97fa53d25d"}
          className="px-2 py-1 hover:bg-gray-100"
        >
          Menu
        </Link>
        <Link to={"about"} className="px-2 py-1 hover:bg-gray-100">
          About
        </Link>
        <Link to={"contact"} className="px-2 py-1 hover:bg-gray-100">
          Contact
        </Link>
      </nav>
    </div>
  )}
</div>

        </div>
      </div>

      {/* mobile */}
    </header>
  );
};

export default Header;