
import { useNavigate } from "react-router-dom";
import "./Courses.css";
import search_icon from "../images/search_icon.svg";

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
      price: 1500,
      description:
        "Comprehensive coverage of NCERT syllabus with additional problem-solving sessions, revision tests, and doubt-clearing classes.",
    },
    {
      id: 3,
      title: "Class 10",
      price: 1500,
      description:
        "Board exam-focused preparation with mock tests, solved previous year papers, and guidance for scoring maximum marks.",
    },
    {
      id: 4,
      title: "Class 11",
      price: 1500,
      description:
        "In-depth preparation for higher secondary syllabus with focus on competitive exam readiness.",
      streams: [
        {
          id: 41,
          name: "Science",
          description:
            "Science stream including Physics, Chemistry, Biology, and Mathematics.",
        },
        {
          id: 42,
          name: "Commerce",
          description:
            "Commerce stream including Accountancy, Business Studies, and Economics.",
        },
        {
          id: 43,
          name: "Arts",
          description:
            "Arts stream including History, Political Science, and Geography.",
        },
      ],

    },
    {
      id: 5,
      title: "Class 12",
      price: 1500,
      description:
        "Comprehensive coverage of board syllabus, advanced problem-solving, and competitive exam guidance.",
      streams: [
        {
          id: 51,
          name: "Science",
          description:
            "Science stream including Physics, Chemistry, Biology, and Mathematics.",
        },
        {
          id: 52,
          name: "Commerce",
          description:
            "Commerce stream including Accountancy, Business Studies, and Economics.",
        },
        {
          id: 53,
          name: "Arts",
          description:
            "Arts stream including History, Political Science, and Geography.",
        },
      ],
    },
  ];

  const class8to10 = courses.filter((c) => c.id <= 3);
  const class11 = courses.find((c) => c.id === 4);
  const class12 = courses.find((c) => c.id === 5);

  return (




    <div className="courses-section">

      <div className="search-container">
        <form action="">
          <button type="submit"><img src={search_icon} alt="" /></button>
          <input type="text" placeholder="Search courses.." name="search" />
        </form>
      </div>

      <div className="courses-container">
        <div className="page-header">
          <h1>Courses</h1>
          <p>
            Explore our structured courses designed to build strong foundations,
            conceptual clarity, and exam readiness for every class.
          </p>
        </div>

        <div className="courses-content-wrapper">
          <button className="back-btn-repositioned" onClick={() => navigate("/")}>
            ←
          </button>

          {/* Grid for Class 8, 9, 10 */}
          <div className="courses-grid">
            {class8to10.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h2 className="course-title">{course.title}</h2>
                  <span className="course-price">₹{course.price}</span>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-buttons">
                  <button
                    onClick={() => navigate(`/enroll/${course.id}`)}
                    className="enroll-btn"
                  >
                    Enroll
                  </button>
                  <button
                    onClick={() => navigate(`/class/${course.id + 7}`)}
                    className="details-btn"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Class 11 Wide Card */}
          <div className="wide-course-card">
            <div className="course-header">
              <h2 className="course-title">{class11.title}</h2>
              <span className="course-price">₹{class11.price}</span>
            </div>
            <p className="course-description">{class11.description}</p>
            <div className="streams-section">
              <h3>Streams</h3>
              <div className="wide-streams-grid">
                {class11.streams.map((stream) => (
                  <div key={stream.id} className="stream-card">
                    <h4 className="stream-name">{stream.name}</h4>
                    <p className="stream-description">{stream.description}</p>
                    <div className="course-buttons">
                      <button
                        onClick={() => navigate(`/enroll/${stream.id}`)}
                        className="enroll-btn"
                      >
                        Enroll
                      </button>
                      <button
                        onClick={() => navigate(`/class/${stream.id}`)}
                        className="details-btn"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Class 12 Wide Card */}
          <div className="wide-course-card">
            <div className="course-header">
              <h2 className="course-title">{class12.title}</h2>
              <span className="course-price">₹{class12.price}</span>
            </div>
            <p className="course-description">{class12.description}</p>
            <div className="streams-section">
              <h3>Streams</h3>
              <div className="wide-streams-grid">
                {class12.streams.map((stream) => (
                  <div key={stream.id} className="stream-card">
                    <h4 className="stream-name">{stream.name}</h4>
                    <p className="stream-description">{stream.description}</p>
                    <div className="course-buttons">
                      <button
                        onClick={() => navigate(`/enroll/${stream.id}`)}
                        className="enroll-btn"
                      >
                        Enroll
                      </button>
                      <button
                        onClick={() => navigate(`/class/${stream.id}`)}
                        className="details-btn"
                      >
                        Details
                      </button>
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

export default Courses;

