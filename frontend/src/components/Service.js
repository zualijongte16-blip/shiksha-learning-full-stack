import React from "react";
import "../Service.css";

// Make sure to place your professional icons in src/assets/
import LiveIcon from "../images/live-class.png";
import AcademicIcon from "../images/academic.png";
import DeviceIcon from "../images/device.png";

function Services() {
  const services = [
    {
      icon: LiveIcon,
      title: "Live Classes",
      desc: "Attend interactive live sessions with expert teachers — all from the comfort of your home.",
    },
    {
      icon: AcademicIcon,
      title: "Classes 8-12 Academic Sessions",
      desc: "Comprehensive courses aligned with school curriculum, designed for classes 8 to 12.",
    },
    {
      icon: DeviceIcon,
      title: "Learn from Your Device",
      desc: "Study anytime, anywhere with recorded lessons accessible from your own device.",
    },
  ];

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <h2 className="services-title">
          <span className="black-text">Services</span>{" "}
          <span className="green-text">We Offer</span>
        </h2>

        <div className="services-list">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              <div className="icon-badge">
                <img src={s.icon} alt={s.title} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
