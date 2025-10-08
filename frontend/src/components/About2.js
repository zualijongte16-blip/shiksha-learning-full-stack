import React from "react";
import "./About2.css";

const About2 = () => {
  return (
    <div className="about2-container">
      <header className="about2-header">
        <h1>About Shiksha</h1>
        <p>
          Shiksha is a modern e-learning platform dedicated to empowering learners with quality education. 
          Our mission is to make learning accessible, engaging, and effective for everyone.
        </p>
      </header>

      <section className="about2-cards">
        <div className="about2-card">
          <h2>Our Vision</h2>
          <p>
            To provide learners with the skills and knowledge they need to thrive in the modern world.
          </p>
        </div>

        <div className="about2-card">
          <h2>Our Mission</h2>
          <p>
            Deliver high-quality, accessible education using innovative technology and expert guidance.
          </p>
        </div>

        <div className="about2-card">
          <h2>Our Values</h2>
          <p>
            Commitment, quality, inclusivity, and innovation drive everything we do at Shiksha.
          </p>
        </div>

        <div className="about2-card">
          <h2>Our Team</h2>
          <p>
            A passionate team of educators, technologists, and content creators dedicated to student success.
          </p>
        </div>

        <div className="about2-card">
          <h2>Why Choose Shiksha?</h2>
          <p>
            Interactive courses, live classes, personalized dashboards, and a vibrant learning community.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About2;
