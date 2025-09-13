import React from "react";
import "../Service.css";

function Services() {
  return (
    <section id="services" className="services-section">
      {/* Section heading */}
      <h2 className="services-title">Services We Offer</h2>

      {/* Service items */}
      <div className="services-list">
        <div className="service-card">
          <h3>📺 Live Classes</h3>
          <p>Attend interactive live classes with expert teachers from the comfort of your home.</p>
        </div>

        <div className="service-card">
          <h3>📘 Academic Sessions (Class 8–12)</h3>
          <p>Comprehensive courses aligned with school curriculum, designed for classes 8 to 12.</p>
        </div>

        <div className="service-card">
          <h3>💻 Learn on Your Device</h3>
          <p>Study anytime, anywhere — directly from your own device with recorded lessons.</p>
        </div>
      </div>
    </section>
  );
}

export default Services;
