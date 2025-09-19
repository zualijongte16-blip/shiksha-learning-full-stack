import React, { useState } from 'react';
import './Dashboard.css';
import classScheduleImg from '../images/class-schedule.png';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = ({ onLogout }) => {
  const [courses] = useState([
    { id: 1, name: 'Mathematics', status: 'In Progress', progress: 40 },
    { id: 2, name: 'History', status: 'Completed', progress: 100 },
    { id: 3, name: 'Computer Science', status: 'Pending', progress: 0 },
  ]);
  const [assignments] = useState([
    { name: 'Assignment 1', dueDate: '2024-05-01' },
    { name: 'Assignment 2', dueDate: '2024-06-05' },
    { name: 'Assignment 3', dueDate: '2024-05-10' },
  ]);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress':
        return 'badge in-progress';
      case 'Completed':
        return 'badge completed';
      case 'Pending':
        return 'badge pending';
      default:
        return 'badge';
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  return (
    <div className="student-dashboard-container">
      <aside className="sidebar">
        <div className="profile-placeholder" />
        <nav className="sidebar-nav">
          <a href="#home" className="nav-link">Home</a>
          <a href="#courses" className="nav-link">Courses</a>
          <a href="#classes" className="nav-link">
            Classes <span className="live-label">LIVE</span>
          </a>
          <a href="#schedule" className="nav-link">Schedule</a>
          <a href="#recorded-video" className="nav-link">Recorded Video</a>
          <a href="#assignment" className="nav-link">Assignment</a>
          <a href="#accounts" className="nav-link">Accounts & Settings</a>
        </nav>
        <button className="logout-button" onClick={onLogout}>
          <span className="logout-icon">↩</span> Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Welcome Back, Student!</h1>
          <input type="text" className="search-input" placeholder="Search" />
        </header>

        <section className="main-grid">
          <div className="summary-section">
            <div className="summary-card">
              <div className="number">{courses.length}</div>
              <div className="label">Courses</div>
            </div>
            <div className="summary-card">
              <div className="number">{assignments.length}</div>
              <div className="label">Assignments</div>
            </div>
          </div>

          <div className="courses-section card">
            <h2>Your Courses</h2>
            <div className="course-list">
              {courses.map((course) => (
                <div key={course.id} className="course-item" onClick={() => handleCourseClick(course)} style={{ cursor: 'pointer' }}>
                  <div className="course-name">{course.name}</div>
                  <div className={getStatusClass(course.status)}>{course.status}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="announcement-section card">
            <h3>Announcement</h3>
            <div className="announcement-content"></div>
          </aside>

          <aside className="right-sidebar">
            <div className="progress-card card">
              <h3>Progress</h3>
              <svg className="progress-circle" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray="75, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage" textAnchor="middle">
                  75%
                </text>
              </svg>
            </div>

            <div className="assignments-card card">
              <h3>Upcoming Assignments</h3>
              <select className="assignment-dropdown">
                {assignments.map((assignment, idx) => (
                  <option key={idx} value={assignment.name}>
                    {assignment.name} - {assignment.dueDate}
                  </option>
                ))}
              </select>
            </div>

          <div className="schedule-card card">
            <h3>Class Schedule</h3>
            <img
              src={classScheduleImg}
              alt="Class Schedule"
              className="schedule-thumbnail"
              onClick={() => setShowModal(true)}
              style={{ cursor: 'pointer', maxWidth: '150px', height: 'auto' }}
            />
            {showModal && (
              <div className="modal-overlay" onClick={() => setShowModal(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <img src={classScheduleImg} alt="Class Schedule Large" className="schedule-large" />
                  <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                </div>
              </div>
            )}
          </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
