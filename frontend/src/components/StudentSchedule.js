import React, { useState, useEffect } from 'react';
import './StudentSchedule.css';

const StudentSchedule = ({ studentClass = '8', studentStream = 'general' }) => {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimetable();
  }, [studentClass, studentStream]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/timetables/${studentClass}/${studentStream}`);
      if (response.ok) {
        const data = await response.json();
        setTimetable(data.timetable || {});
      } else {
        setError('Failed to load schedule');
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': '#FF6B35',
      'English': '#0F5132',
      'Science': '#3B82F6',
      'Physics': '#9333EA',
      'Chemistry': '#F59E0B',
      'Biology': '#10B981',
      'History': '#EF4444',
      'Geography': '#8B5CF6',
      'Computer Science': '#06B6D4',
      'Arts': '#EC4899',
      'Physical Education': '#84CC16',
      'default': '#6B7280'
    };
    return colors[subject] || colors.default;
  };

  if (loading) {
    return (
      <div className="schedule-loading">
        <div className="loading-spinner">⏳</div>
        <p>Loading your schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schedule-error">
        <p>❌ {error}</p>
        <button onClick={fetchTimetable} className="retry-btn">Retry</button>
      </div>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="student-schedule">
      <div className="schedule-header">
        <h2>Class Schedule</h2>
        <div className="schedule-info">
          <span className="class-info">Class: {studentClass}</span>
          {studentClass >= 11 && <span className="stream-info">Stream: {studentStream}</span>}
        </div>
      </div>

      <div className="timetable-container">
        <table className="timetable">
          <thead>
            <tr>
              <th>Day</th>
              {periods.map(period => (
                <th key={period}>Period {period}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="day-cell">{day}</td>
                {periods.map(period => {
                  const subject = timetable[studentClass]?.[studentStream]?.[day]?.[period.toString()] || '';
                  return (
                    <td key={period} className="period-cell">
                      {subject ? (
                        <div
                          className="subject-block"
                          style={{ backgroundColor: getSubjectColor(subject) }}
                        >
                          <span className="subject-name">{subject}</span>
                        </div>
                      ) : (
                        <div className="empty-period">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="schedule-footer">
        <div className="schedule-legend">
          <h3>Subject Legend</h3>
          <div className="legend-items">
            {Object.keys(timetable[studentClass]?.[studentStream] || {})
              .flatMap(day => Object.values(timetable[studentClass][studentStream][day] || {}))
              .filter((value, index, self) => self.indexOf(value) === index && value)
              .map(subject => (
                <div key={subject} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: getSubjectColor(subject) }}
                  ></div>
                  <span>{subject}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="schedule-notes">
          <h3>Schedule Notes</h3>
          <ul>
            <li>Each period is approximately 45 minutes long</li>
            <li>Break periods are not scheduled with subjects</li>
            <li>Schedule is set by your teachers and may be updated</li>
            <li>Contact your class teacher for any schedule changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
