import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import email_icon from '../images/envelope.svg'
import location_icon from '../images/location.svg'
import phone_icon from '../images/phone_icon.svg'

import "./Contact2.css";

const Contact2 = () => {
  return (
    <div className="contact2-container">
      {/* Header */}
      <header className="contact2-header">
        <h1>Contact Shiksha</h1>
        <p>
          Get in touch with us! Here is how you can reach Shiksha.
        </p>
      </header>

      {/* Contact Information */}
      <section className="contact2-info">
        <div className="contact2-card">
          <img src={location_icon} alt="" />
          <h2>Head Office</h2>
          <p>
            Shiksha E-Learning Pvt. Ltd.<br />
            123 Knowledge Street<br />
            Education City, IN 560001
          </p>
        </div>

        <div className="contact2-card">
          <img src={email_icon} alt="" />

          <h2>Email</h2>
          <p>
            support@shiksha.com<br />
            info@shiksha.com
          </p>
        </div>

        <div className="contact2-card">
          <img src={phone_icon} alt="" />
          <h2>Phone</h2>
          <p>
            +91 98765 43210<br />
            +91 91234 56789
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact2;
