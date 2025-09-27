import React from "react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Class 8",
      price: 1500,
      description:
        "Strong foundation in Mathematics, Science, and English. Helps prepare for board exams with conceptual clarity and practice materials.",
    },
    {
      id: 2,
      title: "Class 9",
      price: 1800,
      description:
        "Comprehensive coverage of NCERT syllabus with additional problem-solving sessions, revision tests, and doubt-clearing classes.",
    },
    {
      id: 3,
      title: "Class 10",
      price: 2000,
      description:
        "Board exam-focused preparation with mock tests, solved previous year papers, and guidance for scoring maximum marks.",
    },
    {
      id: 4,
      title: "Class 11",
      price: 2200,
      description:
        "In-depth preparation for higher secondary syllabus with focus on competitive exam readiness.",
    },
    {
      id: 5,
      title: "Class 12",
      price: 2500,
      description:
        "Comprehensive coverage of board syllabus, advanced problem-solving, and competitive exam guidance.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Page heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Courses</h1>
        <p className="text-sm text-gray-600 mb-10">
          Explore our well-structured courses designed to provide strong foundations,
          conceptual clarity, and exam readiness for every class.
        </p>

        {/* Course cards */}
        <div className="space-y-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border rounded-lg shadow-sm p-6 transition-transform duration-300 ease-out hover:shadow-md hover:-translate-y-2"
            >
              {/* Title + Price */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {course.title}
                </h2>
                <span className="text-lg font-medium text-green-700">
                  ₹{course.price}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 mb-6">
                {course.description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                {/* Enroll → goes to payment page */}
                <button
                  onClick={() => navigate(`/payment/${course.id}`)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-green-700 transition-colors duration-200"
                >
                  Enroll
                </button>

                {/* Detail → goes to detail page */}
                <button
                  onClick={() => navigate(`/class/${course.id + 7}`)}
                  className="flex-1 border border-gray-700 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
