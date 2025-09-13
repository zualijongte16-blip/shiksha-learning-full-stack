import React from "react";
import "../About.css";

const About = () => {
  return (
    <section className="about-section">
      <h2>
        About <span className="highlight">Shiksha</span>
      </h2>

      <div className="about-cards">
        <div className="card"></div>

        <div className="card testimonial">
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua."
          </p>
          <h4>Sir. Lorem Ipsum</h4>
          <span>CEO - Shiksha</span>
        </div>

        <div className="card"></div>
      </div>
    </section>
  );
};

export default About;
