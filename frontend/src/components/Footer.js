import React from "react";
import "../Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>Shiksha<span> </span></h2>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
           <p> sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          </p>
        </div>

        <div className="footer-info">
          <div className="address">
            <h4>Address</h4>
            <p>Aizawl, Mizoram<br />796009</p>
          </div>

          <div className="contact">
            <h4>Contact</h4>
            <p>+91 xxxxxxxxxx</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        ©2025, Shiksha.inc
      </div>
    </footer>
  );
};

export default Footer;
