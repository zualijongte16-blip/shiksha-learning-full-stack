import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const classData = {
  "8": {
    title: "Class 8",
    price: "₹1,500",
    description:
      "Strong foundation in Mathematics, Science, and English. Helps prepare for board exams with conceptual clarity and practice materials.",
  },
  "9": {
    title: "Class 9",
    price: "₹1,800",
    description:
      "Comprehensive coverage of NCERT syllabus with additional problem-solving sessions, revision tests, and doubt-clearing classes.",
  },
  "10": {
    title: "Class 10",
    price: "₹2,000",
    description:
      "Board exam-focused preparation with mock tests, solved previous year papers, and guidance for scoring maximum marks.",
  },
  "11": {
    title: "Class 11",
    price: "₹2,200",
    description:
      "In-depth preparation for higher secondary syllabus with focus on competitive exam readiness.",
  },
  "12": {
    title: "Class 12",
    price: "₹2,500",
    description:
      "Comprehensive coverage of board syllabus, advanced problem-solving, and competitive exam guidance.",
  },
};

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = classData[id];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl text-red-600">Class {id} details not found.</h2>
        <button
          onClick={() => navigate("/")}
          className="ml-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
        <p className="text-3xl text-gray-700 mb-4">{data.price}</p>

        <p className="text-xl text-gray-700">{data.description}</p>

        {[1, 2, 3, 4].map((subject) => (
          <div key={subject} className="mb-6">
            <p className="text-2xl font-semibold">Subject {subject}</p>
            <p className="text-lg text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}

        <div className="flex gap-4 mt-6">
          <button className="bg-green-700 text-white px-6 py-2 rounded shadow hover:bg-green-800">
            Enroll
          </button>
          <button
            onClick={() => navigate("/")}
            className="border border-gray-800 px-6 py-2 rounded hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
