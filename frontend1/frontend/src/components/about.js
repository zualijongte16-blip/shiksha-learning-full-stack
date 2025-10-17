import React, { useRef, useState, useEffect } from "react";
import "../About.css";
import arrowRight from "../images/arrow_right.svg";
import arrowLeft from "../images/arrow_left.svg";
import shikshaImg from "../images/Shiksa_logo.png";
import teamImg from "../images/Shiksa_logo.png";
import courseImg from "../images/Shiksa_logo.png";

const About = () => {
  const trackRef = useRef(null); // viewport
  const listRef = useRef(null);  // track
  const [currentIndex, setCurrentIndex] = useState(0);

  const aboutSections = [
    {
      img: shikshaImg,
      title: "About Shiksha",
      text: "Shiksha is a platform dedicated to empowering students with accessible, quality learning resources and tools.",
    },
    {
      img: teamImg,
      title: "Our Team",
      text: "Our team is a group of passionate educators, developers, and innovators working to build impactful digital learning solutions.",
    },
    {
      img: courseImg,
      title: "Our Courses",
      text: "We provide structured courses designed to match the needs of modern learners, blending theory with practical applications.",
    },
  ];

  const total = aboutSections.length;

  // Scroll to current index
  const scrollToIndex = (index) => {
    if (!listRef.current || !trackRef.current) return;
    const li = listRef.current.children[index];
    if (!li) return;
    const left = li.offsetLeft;
    trackRef.current.scrollTo({ left, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <section className="about-section">
      <h2>
        About <span className="highlight">Shiksha</span>
      </h2>

      <div className="about-carousel">
        {/* Prev button */}
        <button
          className={`nav-btn back_btn ${currentIndex === 0 ? "disabled" : ""}`}
          onClick={handlePrev}
          aria-label="Previous"
        >
          <img src={arrowLeft} alt="Prev" />
        </button>

        {/* Next button */}
        <button
          className={`nav-btn next-btn ${
            currentIndex === total - 1 ? "disabled" : ""
          }`}
          onClick={handleNext}
          aria-label="Next"
        >
          <img src={arrowRight} alt="Next" />
        </button>

        <div className="slider" ref={trackRef}>
          <ul ref={listRef}>
            {aboutSections.map((section, idx) => (
              <li key={idx}>
                <div className="about-card">
                  <img src={section.img} alt={section.title} />
                  <h3>{section.title}</h3>
                  <p>{section.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
