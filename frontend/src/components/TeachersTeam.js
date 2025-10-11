import React from "react";
import "./Contact2.css";

const TeachersTeam = () => {
  const teamMembers = [
    {
      name: "Jane Smith",
      role: "Head of Content",
      bio: "Jane oversees all educational content creation, ensuring high-quality materials for our students.",
      email: "jane.smith@shiksha.com",
      phone: "+91 98765 43211",
      image: "https://via.placeholder.com/80?text=JS"
    },
    {
      name: "Rahul Kumar",
      role: "Lead Instructor",
      bio: "Rahul is our expert instructor specializing in mathematics and science subjects.",
      email: "rahul.kumar@shiksha.com",
      phone: "+91 98765 43212",
      image: "https://via.placeholder.com/80?text=RK"
    },
    {
      name: "Anita Verma",
      role: "Student Support",
      bio: "Anita provides dedicated support to students, helping them navigate their learning journey.",
      email: "anita.verma@shiksha.com",
      phone: "+91 98765 43213",
      image: "https://via.placeholder.com/80?text=AV"
    }
  ];

  return (
    <div className="contact2-container">
      <header className="contact2-header">
        <h1>Teachers Team</h1>
        <p>Meet our dedicated educators and content creators.</p>
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
              <p><strong>Phone:</strong> {member.phone}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeachersTeam;
