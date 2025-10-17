import React from "react";
import "../ContactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-text">
          <h2>
            Contact <span>us</span>
          </h2>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua."
          </p>
          <p className="contact-email">email@gmail.com</p>
        </div>

        <form className="contact-form">
          <label>
            Name (required)
            <div className="name-inputs">
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
            </div>
          </label>

          <label>
            Email (required)
            <input type="email" placeholder="Email" required />
          </label>

          <label>
            Message (required)
            <textarea placeholder="Your message..." required></textarea>
          </label>

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
