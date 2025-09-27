import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Courses from "./pages/Courses"; // make sure this path matches your folder
import ClassDetail from "./pages/ClassDetail";

const Home = () => (
  <div className="p-10">
    <h1 className="text-3xl font-bold">Welcome to Shiksha</h1>
    <p className="mt-4 text-gray-700">Click below to view courses.</p>

    <Link
      to="/courses"
      className="mt-6 inline-block bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition"
    >
      Go to Courses
    </Link>
  </div>
);

function App() {
  return (
    <Router>
      {/*  Navbar Section awmna */}
      <nav className="bg-gradient-to-r from-green-100 to-green-300 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center h-16">
      <Link to="/" className="flex items-center">
        <img
          src="/shiksha-logo.png"
          alt="Shiksha Logo"
          className="h-10 w-10 mr-2"
        />
        <span className="text-lg font-semibold text-green-900 transition duration-200 hover:text-green-700 hover:scale-105">
          Shiksha
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/*  Routing Section awmna */}
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/class/:id" element={<ClassDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
