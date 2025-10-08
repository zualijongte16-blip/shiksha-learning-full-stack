import React from "react";
import "./Contact2.css";

const Contact2 = () => {
  return (
    <div className="contact2-container">
      {/* Header */}
      <header className="contact2-header">
        <h1>Contact Shiksha</h1>
        <p>
          Get in touch with us! Here is how you can reach Shiksha and some of our key team members.
        </p>
      </header>

      {/* Contact Information */}
      <section className="contact2-info">
        <div className="contact2-card">
          <h2>Head Office</h2>
          <p>
            Shiksha E-Learning Pvt. Ltd.<br />
            123 Knowledge Street<br />
            Education City, IN 560001
          </p>
        </div>

        <div className="contact2-card">
          <h2>Email</h2>
          <p>
            support@shiksha.com<br />
            info@shiksha.com
          </p>
        </div>

        <div className="contact2-card">
          <h2>Phone</h2>
          <p>
            +91 98765 43210<br />
            +91 91234 56789
          </p>
        </div>
      </section>

      {/* Partial Employee Details */}
      <section className="contact2-employees">
        <h2>Meet Some of Our Team</h2>
        <div className="employee-cards">
          <div className="employee-card">
            <h3>John Doe</h3>
            <p>CEO & Founder</p>
          </div>
          <div className="employee-card">
            <h3>Jane Smith</h3>
            <p>Head of Content</p>
          </div>
          <div className="employee-card">
            <h3>Rahul Kumar</h3>
            <p>Lead Instructor</p>
          </div>
          <div className="employee-card">
            <h3>Anita Verma</h3>
            <p>Student Support</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact2;
