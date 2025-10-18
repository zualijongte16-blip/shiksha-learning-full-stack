import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentCourses.css';

const StudentCourses = () => {
  const navigate = useNavigate();

  // Mock data for courses - assuming some are unlocked based on payment
  const [courses] = useState([
    {
      id: 1,
      title: "Class 8",
      price: 1500,
      unlocked: true, // Mock: assume some are unlocked
      description: "Strong foundation in Mathematics, Science, and English. Helps prepare for board exams with conceptual clarity and practice materials.",
    },
    {
      id: 2,
      title: "Class 9",
      price: 1500,
      unlocked: false,
      description: "Comprehensive coverage of NCERT syllabus with additional problem-solving sessions, revision tests, and doubt-clearing classes.",
    },
    {
      id: 3,
      title: "Class 10",
      price: 1500,
      unlocked: true,
      description: "Board exam-focused preparation with mock tests, solved previous year papers, and guidance for scoring maximum marks.",
    },
    {
      id: 4,
      title: "Class 11",
      price: 1500,
      unlocked: false,
      description: "In-depth preparation for higher secondary syllabus with focus on competitive exam readiness.",
      streams: [
        {
          id: 41,
          name: "Science",
          unlocked: false,
          description: "Science stream including Physics, Chemistry, Biology, and Mathematics.",
        },
        {
          id: 42,
          name: "Commerce",
          unlocked: false,
          description: "Commerce stream including Accountancy, Business Studies, and Economics.",
        },
        {
          id: 43,
          name: "Arts",
          unlocked: false,
          description: "Arts stream including History, Political Science, and Geography.",
        },
      ],
    },
    {
      id: 5,
      title: "Class 12",
      price: 1500,
      unlocked: false,
      description: "Comprehensive coverage of board syllabus, advanced problem-solving, and competitive exam guidance.",
      streams: [
        {
          id: 51,
          name: "Science",
          unlocked: false,
          description: "Science stream including Physics, Chemistry, Biology, and Mathematics.",
        },
        {
          id: 52,
          name: "Commerce",
          unlocked: false,
          description: "Commerce stream including Accountancy, Business Studies, and Economics.",
        },
        {
          id: 53,
          name: "Arts",
          unlocked: false,
          description: "Arts stream including History, Political Science, and Geography.",
        },
      ],
    },
  ]);

  const handlePayment = (courseId, courseTitle) => {
    // Mock payment process
    alert(`Payment initiated for ${courseTitle}. In a real app, this would redirect to payment gateway.`);
    // After payment success, you would update the course status to unlocked
  };

  const handleAccessCourse = (courseId, courseTitle) => {
    // Navigate to course content
    navigate(`/course/${courseId}`);
  };

  const class8to10 = courses.filter((c) => c.id <= 3);
  const class11 = courses.find((c) => c.id === 4);
  const class12 = courses.find((c) => c.id === 5);

  return (
    <div className="student-courses-section">
      <div className="courses-container">
        <div className="page-header">
          <h1>My Courses</h1>
          <p>Access your enrolled courses or purchase new ones to unlock learning materials.</p>
        </div>

        <div className="courses-content-wrapper">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>

          {/* Grid for Class 8, 9, 10 */}
          <div className="courses-grid">
            {class8to10.map((course) => (
              <div key={course.id} className={`course-card ${course.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="course-header">
                  <h2 className="course-title">{course.title}</h2>
                  <span className="course-price">₹{course.price}</span>
                  {!course.unlocked && <span className="lock-icon">🔒</span>}
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-buttons">
                  {course.unlocked ? (
                    <button
                      onClick={() => handleAccessCourse(course.id, course.title)}
                      className="access-btn"
                    >
                      Access Course
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePayment(course.id, course.title)}
                      className="pay-btn"
                    >
                      Pay & Unlock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Class 11 Wide Card */}
          <div className={`wide-course-card ${class11.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="course-header">
              <h2 className="course-title">{class11.title}</h2>
              <span className="course-price">₹{class11.price}</span>
              {!class11.unlocked && <span className="lock-icon">🔒</span>}
            </div>
            <p className="course-description">{class11.description}</p>
            <div className="streams-section">
              <h3>Streams</h3>
              <div className="wide-streams-grid">
                {class11.streams.map((stream) => (
                  <div key={stream.id} className={`stream-card ${stream.unlocked ? 'unlocked' : 'locked'}`}>
                    <h4 className="stream-name">{stream.name}</h4>
                    <p className="stream-description">{stream.description}</p>
                    {!stream.unlocked && <span className="lock-icon">🔒</span>}
                    <div className="course-buttons">
                      {stream.unlocked ? (
                        <button
                          onClick={() => handleAccessCourse(stream.id, `${class11.title} - ${stream.name}`)}
                          className="access-btn"
                        >
                          Access
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePayment(stream.id, `${class11.title} - ${stream.name}`)}
                          className="pay-btn"
                        >
                          Pay & Unlock
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Class 12 Wide Card */}
          <div className={`wide-course-card ${class12.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="course-header">
              <h2 className="course-title">{class12.title}</h2>
              <span className="course-price">₹{class12.price}</span>
              {!class12.unlocked && <span className="lock-icon">🔒</span>}
            </div>
            <p className="course-description">{class12.description}</p>
            <div className="streams-section">
              <h3>Streams</h3>
              <div className="wide-streams-grid">
                {class12.streams.map((stream) => (
                  <div key={stream.id} className={`stream-card ${stream.unlocked ? 'unlocked' : 'locked'}`}>
                    <h4 className="stream-name">{stream.name}</h4>
                    <p className="stream-description">{stream.description}</p>
                    {!stream.unlocked && <span className="lock-icon">🔒</span>}
                    <div className="course-buttons">
                      {stream.unlocked ? (
                        <button
                          onClick={() => handleAccessCourse(stream.id, `${class12.title} - ${stream.name}`)}
                          className="access-btn"
                        >
                          Access
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePayment(stream.id, `${class12.title} - ${stream.name}`)}
                          className="pay-btn"
                        >
                          Pay & Unlock
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
