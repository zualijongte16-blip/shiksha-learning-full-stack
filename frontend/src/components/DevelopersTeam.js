import React from "react";
import "./Contact2.css";
import possumImage from "../images/cartoon-like-possum-illustration.jpg";

const DevelopersTeam = () => {
  const teamMembers = [
    {
      name: "Nilima Mahata",
      role: "Developer",
      bio: "Full-stack developer.",
      email: "nilimahata0409@gmail.com",
      image: possumImage
    },
    {
      name: "Svyatoslav Sytar",
      role: "Developer",
      bio: "Svyatoslav focuses on backend architecture and performance optimization.",
      email: "svyatoslav.sytar@shiksha.com",
      image: possumImage
    },
    {
      name: "Michael Thery",
      role: "Developer",
      bio: "Michael handles frontend UI/UX implementation and responsive design.",
      email: "michael.thery@shiksha.com",
      image: possumImage
    },
    {
      name: "Ann Plan",
      role: "Developer",
      bio: "Ann contributes to database management and API integrations.",
      email: "ann.plan@shiksha.com",
      image: possumImage
    },
    {
      name: "Tomislav",
      role: "Developer",
      bio: "Tomislav works on mobile responsiveness and cross-browser compatibility.",
      email: "tomislav@shiksha.com",
      image: possumImage
    },
    {
      name: "Parth Radadiya",
      role: "Developer",
      bio: "Parth develops testing frameworks and ensures code quality.",
      email: "parth.radadiya@shiksha.com",
      image: possumImage
    },
  ];

  return (
    <div className="contact2-container">
      <header className="contact2-header">
        <h1>Developers Team</h1>
        <p>Meet our talented developers building the future of education technology.</p>
      </header>

      <section className="contact2-employees">
        <div className="employee-cards">
          {teamMembers.map((member, index) => (
            <div key={index} className="employee-card">
              <img src={member.image} alt={member.name} className="profile-pic" />
              <h3>{member.name}</h3>
              <p><strong>{member.role}</strong></p>
              <p>{member.bio}</p>
              <p><strong>Email:</strong> {member.email}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DevelopersTeam;
