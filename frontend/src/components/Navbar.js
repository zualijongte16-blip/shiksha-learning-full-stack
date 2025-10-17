import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "../Navbar.css";
import logo from "../images/Shiksa_logo.png";
import menu_icon from "../images/menu_logo.png"

function Navbar({ onLoginClick, onSignupClick }) {

  const [mobileMenu, setMobileMenu] = useState(false);
  const toggleMenu = () => {
    mobileMenu ? setMobileMenu(false) : setMobileMenu(true);
  }

  return (
    <nav className="navbar">

      {/* Sidebar Menu */}
        <img src={menu_icon} className="menu_icon"  onClick={toggleMenu}/>


      {/* Left side: logo + name */}
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="logo" />
        <span className="brand-name">
          <span className="black">Shik</span>
          <span className="green">sha</span>
        </span>
      </div>

      {/* Middle: navigation links */}
      <ul className={mobileMenu ? '' : 'hide-mobile-menu'}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/service">Services</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      {/* Right side: login/signup */}
      <div className="navbar-auth" style={{ display: 'flex', justifyContent: 'center', gap: '8px', width: 'auto' }}>
        <button onClick={onLoginClick} className="login-btn" style={{ width: '70px', height: '28px', fontSize: '13px', alignItems: 'center' }}>Login</button>
        <button onClick={onSignupClick} className="signup-btn" style={{ width: '70px', height: '28px', fontSize: '13px', alignItems: 'center' }}>Signup</button>
      </div>
    </nav>
  );
}

export default Navbar;
