import React from "react";
import "./Service2.css";

const Service2 = () => {
  return (
    <div className="service2-container">
      <header className="service2-header">
        <h1>Our Shiksha E-Learning Services</h1>
        <p>
          Shiksha provides a comprehensive e-learning platform to empower students and educators alike.
          Explore our services designed to deliver seamless learning experiences anytime, anywhere.
        </p>
      </header>

      <section className="service2-cards">
        <div className="service2-card">
          <h2>Online Courses</h2>
          <p>
            Access a wide variety of curated courses across multiple subjects, designed by expert educators.
          </p>
        </div>

        <div className="service2-card">
          <h2>Interactive Live Classes</h2>
          <p>
            Participate in real-time sessions with instructors, ask questions, and engage with classmates.
          </p>
        </div>

        <div className="service2-card">
          <h2>Assignments & Quizzes</h2>
          <p>
            Track your progress with interactive quizzes and assignments tailored to reinforce learning.
          </p>
        </div>

        <div className="service2-card">
          <h2>Student Dashboard</h2>
          <p>
            Monitor attendance, track performance, and receive personalized recommendations on your learning path.
          </p>
        </div>

        <div className="service2-card">
          <h2>Teacher Dashboard</h2>
          <p>
            Manage courses, assignments, and student progress efficiently with our teacher-friendly interface.
          </p>
        </div>

        <div className="service2-card">
          <h2>Community & Support</h2>
          <p>
            Connect with fellow learners and educators, get guidance, and join Shiksha’s active learning community.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Service2;
