import React from 'react';
import './StudentQueries.css';

const StudentQueries = ({ 
  queries = [
    {
      id: 1,
      student: "Ronald Richards",
      avatar: "👨‍🎓",
      question: "Why conduct User research need for UX design?",
      status: "Decline",
      action: "View Details"
    },
    {
      id: 2,
      student: "Bessie Cooper",
      avatar: "👩‍🎓",
      question: "Empathy map creation process",
      status: "Decline",
      action: "View Details"
    },
    {
      id: 3,
      student: "Ralph Edwards",
      avatar: "👨‍🎓",
      question: "Rules of Usability testing and importance",
      status: "Decline",
      action: "View Details"
    },
    {
      id: 4,
      student: "Cameron Williamson",
      avatar: "👨‍🎓",
      question: "How to create a clean UI to impress users",
      status: "Decline",
      action: "View Details"
    }
  ]
}) => {
  return (
    <div className="student-queries">
      <h3>Student Queries</h3>
      <div className="queries-list">
        {queries.map((query) => (
          <div key={query.id} className="query-item">
            <div className="query-avatar">
              {query.avatar}
            </div>
            <div className="query-content">
              <div className="query-header">
                <h4 className="query-title">{query.question}</h4>
                <span className={`query-status ${query.status.toLowerCase()}`}>
                  {query.status}
                </span>
              </div>
              <div className="query-student">
                {query.student}
              </div>
            </div>
            <div className="query-actions">
              <button className="view-details-btn">
                {query.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentQueries;