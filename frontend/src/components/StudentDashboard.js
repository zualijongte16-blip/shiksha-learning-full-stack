import React from 'react';
import './Dashboard.css';

const StudentDashboard = ({ onLogout, userName }) => {
  // Dummy data as per screenshot
  const courses = [
    { name: 'Mathematics', status: 'In Progress' },
    { name: 'History', status: 'Completed' },
    { name: 'Computer Science', status: 'Pending' },
  ];

  const assignments = [
    { name: 'Assignment 1', dueDate: '2024-05-01' },
    { name: 'Assignment 2', dueDate: '2024-06-05' },
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

  return (
    <div className="student-dashboard-container">
      <aside className="sidebar">
        <div className="profile-placeholder" />
        <div className="username-display">
          <strong>{userName}</strong>
        </div>
        <a href="#change-username" className="change-username-link">Change Username</a>
        <a href="#change-password" className="change-password-link">Change Password</a>
        <nav className="sidebar-nav">
          <a href="#courses" className="nav-link active">Courses</a>
          <a href="#announcement" className="nav-link">Announcement</a>
          <a href="#classes" className="nav-link">
            Classes <span className="new-label">new</span>
          </a>
          <a href="#accounts" className="nav-link">Accounts & Settings</a>
          <a href="#schedule" className="nav-link">Schedule</a>
          <a href="#discussions" className="nav-link">Discussions</a>
        </nav>
        <button className="logout-button" onClick={onLogout}>
          <span className="logout-icon">↩</span> Logout
        </button>
      </aside>

      <main className="main-content">
        <section className="welcome-banner">
          <h2>Welcome Back, {userName}!</h2>
          <p>
         Welcome baaaack, Dear future IAS officer
          </p>
        </section>

        <section className="stats-cards">
          <div className="card stat-card">
            <div className="stat-number">3</div>
            <div className="stat-label">Courses</div>
          </div>
          <div className="card stat-card">
            <div className="stat-number">4</div>
            <div className="stat-label">Assignments</div>
          </div>
        </section>

        <section className="dashboard-lower">
          <div className="courses-list card expanded-card">
            <h3>Your Courses</h3>
            <a href="#change-username" className="change-username-link">Change Username</a>
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

          <div className="progress-upcoming card expanded-card">
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
                <text x="18" y="20.35" className="percentage" textAnchor="middle">{progressPercent}%</text>
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
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
