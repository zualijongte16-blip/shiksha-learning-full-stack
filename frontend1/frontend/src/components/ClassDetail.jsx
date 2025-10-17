import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ClassDetail.css";

const classData = {
  "8": {
    title: "Class 8",
    price: "₹1,500",
    description:
      "Strong foundation in Mathematics, Science, and English. Helps prepare for board exams with conceptual clarity and practice materials.",
    subjects: [
      { name: "Mathematics", description: "Conceptual learning with examples and exercises." },
      { name: "Science", description: "Understand basics through experiments and visuals." },
      { name: "English", description: "Improve grammar and comprehension skills." },
    ],
  },
  "9": {
    title: "Class 9",
    price: "₹1,500",
    description:
      "Comprehensive coverage of NCERT syllabus with additional problem-solving sessions, revision tests, and doubt-clearing classes.",
    subjects: [
      { name: "Mathematics", description: "Algebra, geometry, and problem-solving techniques." },
      { name: "Science", description: "Detailed lessons with concept clarity and experiments." },
      { name: "English", description: "Focus on writing, reading, and grammar accuracy." },
      { name: "Social Studies", description: "History, Civics, Geography in depth." },
    ],
  },
  "10": {
    title: "Class 10",
    price: "₹1,500",
    description:
      "Board exam-focused preparation with mock tests, solved previous year papers, and guidance for scoring maximum marks.",
    subjects: [
      { name: "Mathematics", description: "Board-level problem solving and analysis." },
      { name: "Science", description: "Practical-based learning for Physics, Chemistry, and Biology." },
      { name: "English", description: "Exam-focused grammar and writing sessions." },
      { name: "Social Studies", description: "History, Political Science, Geography, and Economics." },
    ],
  },
  "11": {
    title: "Class 11",
    price: "₹1,500",
    description:
      "In-depth preparation for higher secondary syllabus with focus on competitive exam readiness.",
  },
  "12": {
    title: "Class 12",
    price: "₹1,500",
    description:
      "Comprehensive coverage of board syllabus, advanced problem-solving, and competitive exam guidance.",
  },
  "41": {
    title: "Class 11 Science",
    price: "₹1,500",
    description:
      "Comprehensive Science stream preparation including Physics, Chemistry, Biology, and Mathematics. Focus on JEE and NEET foundation with advanced problem-solving.",
    subjects: [
      { name: "Physics", description: "Fundamental concepts of mechanics, optics, and thermodynamics." },
      { name: "Chemistry", description: "Organic and inorganic chemistry with practical experiments." },
      { name: "Biology", description: "Cell biology, genetics, and human physiology." },
      { name: "Mathematics", description: "Algebra, calculus, and coordinate geometry." },
    ],
  },
  "42": {
    title: "Class 11 Commerce",
    price: "₹1,500",
    description:
      "Detailed Commerce stream covering Accountancy, Business Studies, and Economics. Prepares for CA, CS, and competitive exams with practical insights.",
    subjects: [
      { name: "Accountancy", description: "Financial accounting principles and bookkeeping." },
      { name: "Business Studies", description: "Management, marketing, and business environment." },
      { name: "Economics", description: "Micro and macro economics fundamentals." },
    ],
  },
  "43": {
    title: "Class 11 Arts",
    price: "₹1,500",
    description:
      "Arts stream education in History, Political Science, and Geography. Enhances critical thinking and prepares for humanities-based careers and exams.",
    subjects: [
      { name: "History", description: "Ancient, medieval, and modern Indian history." },
      { name: "Political Science", description: "Political theories and Indian constitution." },
      { name: "Geography", description: "Physical and human geography of India." },
    ],
  },
  "51": {
    title: "Class 12 Science",
    price: "₹1,500",
    description:
      "Advanced Science stream with Physics, Chemistry, Biology, and Mathematics. Intensive preparation for board exams, JEE, and NEET with mock tests.",
    subjects: [
      { name: "Physics", description: "Electromagnetism, modern physics, and electronics." },
      { name: "Chemistry", description: "Physical, organic, and inorganic chemistry." },
      { name: "Biology", description: "Ecology, biotechnology, and evolution." },
      { name: "Mathematics", description: "Calculus, vectors, and probability." },
    ],
  },
  "52": {
    title: "Class 12 Commerce",
    price: "₹1,500",
    description:
      "Commerce stream final year with Accountancy, Business Studies, and Economics. Focus on board exams and professional course entrances like CA and MBA.",
    subjects: [
      { name: "Accountancy", description: "Partnership, company accounts, and analysis." },
      { name: "Business Studies", description: "Business finance, human resource management." },
      { name: "Economics", description: "Indian economy, development economics." },
    ],
  },
  "53": {
    title: "Class 12 Arts",
    price: "₹1,500",
    description:
      "Arts stream completion with History, Political Science, and Geography. Prepares for board exams and higher education in social sciences.",
    subjects: [
      { name: "History", description: "World history, Indian freedom struggle." },
      { name: "Political Science", description: "International relations, comparative politics." },
      { name: "Geography", description: "World geography, environmental issues." },
    ],
  },
};

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = classData[id];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger fade-in effect on mount
    setTimeout(() => setVisible(true), 100);
  }, []);

  if (!data) {
    return (
      <div className="not-found">
        <h2>Class {id} details not found.</h2>
        <button onClick={() => navigate("/courses")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className={`class-detail-section ${visible ? "fade-in" : ""}`}>
      <div className="class-detail-container">
        <div className="class-detail-card">
          <div className="class-header">
            <h1 className="class-detail-title">{data.title}</h1>
            <p className="class-detail-price">{data.price}</p>
          </div>

          <p className="class-detail-description">{data.description}</p>

          <div className="subject-list">
            {(data.subjects || []).map((subject, index) => (
              <div key={index} className="subject-section">
                <p className="subject-title">{subject.name}</p>
                <p className="subject-description">{subject.description}</p>
              </div>
            ))}
          </div>

          <div className="buttons-section">
            <button
              onClick={() => alert("Enroll functionality to be implemented")}
              className="enroll-btn"
            >
              Enroll Now
            </button>
            <button onClick={() => navigate("/courses")} className="back-btn">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;