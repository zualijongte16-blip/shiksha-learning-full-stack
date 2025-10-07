import React from "react";
import { Link } from 'react-router-dom';
import "../Navbar.css";
import logo from "../images/Shiksa_logo.png";

function Navbar({ onLoginClick, onSignupClick }) {
  return (
    <nav className="navbar">
      {/* Left side: logo + name */}
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="logo" />
        <span className="brand-name">
          <span className="black">Shik</span>
          <span className="green">sha</span>
        </span>
      </div>

      {/* Middle: navigation links */}
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/service">Services</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      {/* Right side: login/signup */}
      <div className="navbar-auth" style={{ display: 'flex', justifyContent: 'center', gap: '8px', width: 'auto' }}>
        <button onClick={onLoginClick} className="login-btn" style={{ width: '70px', height: '28px', fontSize: '13px' }}>Login</button>
        <button onClick={onSignupClick} className="signup-btn" style={{ width: '70px', height: '28px', fontSize: '13px' }}>Signup</button>
      </div>
    </nav>
  );
}

export default Navbar;
