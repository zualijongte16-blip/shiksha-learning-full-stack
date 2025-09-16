import React, { useState } from 'react';
import './Dashboard.css';
import classScheduleImg from '../images/class-schedule.png'; // Updated to match actual filename

const StudentDashboard = ({ onLogout, userName }) => {
  // Dummy data as per screenshot
  const courses = [
    { name: 'Mathematics', status: 'In Progress' },
    { name: 'History', status: 'Completed' },
    { name: 'Computer Science', status: 'Pending' },
  ];

  const assignments = [
    { name: 'Assignment 1', dueDate: '2024-05-01' },
    { name: 'Assignment 2', dueDate: '2024-05-05' },
    { name: 'Assignment 3', dueDate: '2024-05-10' },
  ];

  const progressPercent = 75;

  // Helper to get badge class based on status
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

  // State for announcement dropdown
  const [announcementOpen, setAnnouncementOpen] = useState(false);

  const toggleAnnouncement = () => {
    setAnnouncementOpen(!announcementOpen);
  };

  return (
    <div className="student-dashboard-container">
      <aside className="sidebar">
        <div className="profile-placeholder" />
        <nav className="sidebar-nav">
          <a href="#home" className="nav-link active">Home</a>
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

      <main className="main-content" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
        <section className="welcome-banner">
          <h2>Welcome Back, {userName || 'Student'}!</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            aria-label="Search"
          />
        </section>

        <section className="stats-cards">
          <div className="card stat-card">
            <div className="stat-number">{courses.length}</div>
            <div className="stat-label">Courses</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number">{assignments.length}</div>
            <div className="stat-label">Assignments</div>
          </div>
        </section>

        <section className="dashboard-main-grid" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
          <div className="courses-list card expanded-card">
            <h3>Your Courses</h3>
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, idx) => (
                  <tr key={idx}>
                    <td>{course.name}</td>
                    <td>
                      <span className={getStatusClass(course.status)}>
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="right-column">
            <div className="progress-upcoming card">
              <div className="progress-section">
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
                    strokeDasharray={`${progressPercent}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage" textAnchor="middle">
                    {progressPercent}%
                  </text>
                </svg>
              </div>

              <div className="upcoming-assignments">
                <h3>Upcoming Assignments</h3>
                <ul>
                  {assignments.map((assignment, idx) => (
                    <li key={idx}>
                      <strong>{assignment.name}</strong><br />
                      <span>{assignment.dueDate}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="announcement-box card" onClick={toggleAnnouncement} style={{ cursor: 'pointer' }}>
              <strong>Announcement</strong>
              <p>
                {announcementOpen
                  ? 'No new announcements at this time.'
                  : 'Click to view announcements'}
              </p>
            </div>

            <div className="class-schedule card">
              <h3>Class Schedule</h3>
              <img
                src={classScheduleImg}
                alt="Class Schedule"
                className="class-schedule-image"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
