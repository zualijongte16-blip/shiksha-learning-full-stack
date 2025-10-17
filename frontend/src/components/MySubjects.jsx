import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MySubjects.css';

const MySubjects = () => {
  const navigate = useNavigate();


  // Enrolled subjects and chapters (what student is actually taking)
  const [enrolledSubjects] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      chapters: [
        { id: 1, name: 'Chapter 1: Linear Equations', completed: true, progress: 100, lastAccessed: '2024-02-15' },
        { id: 2, name: 'Chapter 2: Polynomials', completed: true, progress: 100, lastAccessed: '2024-02-14' },
        { id: 3, name: 'Chapter 3: Algebra Basics', completed: true, progress: 92, lastAccessed: '2024-02-13' },
        { id: 4, name: 'Chapter 4: Quadratic Equations', completed: false, progress: 65, lastAccessed: '2024-02-16' },
        { id: 5, name: 'Chapter 5: Geometry', completed: false, progress: 0, lastAccessed: null }
      ],
      teacher: 'Prof. Sharma',
      overallProgress: 68
    },
    {
      id: 2,
      subject: 'English',
      chapters: [
        { id: 1, name: 'Chapter 1: Parts of Speech', completed: true, progress: 85, lastAccessed: '2024-02-13' },
        { id: 2, name: 'Chapter 2: Tenses', completed: false, progress: 45, lastAccessed: '2024-02-16' },
        { id: 3, name: 'Chapter 3: Sentences', completed: false, progress: 0, lastAccessed: null }
      ],
      teacher: 'Prof. Johnson',
      overallProgress: 43
    },
    {
      id: 3,
      subject: 'Physics',
      chapters: [
        { id: 1, name: 'Chapter 1: Motion', completed: true, progress: 78, lastAccessed: '2024-02-12' },
        { id: 2, name: 'Chapter 2: Forces', completed: false, progress: 30, lastAccessed: '2024-02-15' },
        { id: 3, name: 'Chapter 3: Laws of Motion', completed: false, progress: 0, lastAccessed: null }
      ],
      teacher: 'Prof. Kumar',
      overallProgress: 36
    },
    {
      id: 4,
      subject: 'Chemistry',
      chapters: [
        { id: 1, name: 'Chapter 1: Matter', completed: true, progress: 88, lastAccessed: '2024-02-11' },
        { id: 2, name: 'Chapter 2: Atoms', completed: false, progress: 0, lastAccessed: null }
      ],
      teacher: 'Prof. Singh',
      overallProgress: 44
    }
  ]);

  // Handle subject/chapter click
  const handleChapterClick = (subjectName, chapter) => {
    // In a real app, this would navigate to the specific subject content
    alert(`Opening ${subjectName} - ${chapter.name}. Here you would see the actual lesson content, videos, materials, etc.`);
  };

  // Update logo to use actual Shiksha logo image
  const shikshaLogo = '/images/shikhsa_logo.png';


  return (
    <div className="my-subjects">
      {/* Back button at top-left corner */}
      <div className="top-left-controls">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="subjects-container">
        <div className="subjects-header">
          <h1>My Subjects</h1>
          <p>Continue your learning journey with your enrolled subjects and chapters</p>
        </div>

        <div className="subjects-grid">
          {enrolledSubjects.map((subject) => (
            <div key={subject.id} className="subject-card">
              <div className="subject-header">
                <div className="subject-info">
                  <h2>{subject.subject}</h2>
                  <p className="teacher-name">👨‍🏫 {subject.teacher}</p>
                </div>
                <div className="progress-info">
                  <div className="progress-circle">
                    <span className="progress-text">{subject.overallProgress}%</span>
                  </div>
                  <p className="progress-label">Complete</p>
                </div>
              </div>

              <div className="chapters-list">
                <h3>Chapters</h3>
                {subject.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className={`chapter-item ${chapter.completed ? 'completed' : 'in-progress'}`}
                    onClick={() => handleChapterClick(subject.subject, chapter)}
                  >
                    <div className="chapter-info">
                      <div className="chapter-status">
                        {chapter.completed ? '✅' : '📖'}
                      </div>
                      <div className="chapter-details">
                        <h4>{chapter.name}</h4>
                        {chapter.lastAccessed && (
                          <p>Last accessed: {new Date(chapter.lastAccessed).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="chapter-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${chapter.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{chapter.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {enrolledSubjects.length === 0 && (
          <div className="no-subjects">
            <div className="no-subjects-icon">📚</div>
            <h2>No Subjects Enrolled</h2>
            <p>You haven't enrolled in any subjects yet. Contact your teacher or administrator to get enrolled in subjects.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubjects;