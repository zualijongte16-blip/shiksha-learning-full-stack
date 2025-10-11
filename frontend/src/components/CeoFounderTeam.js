import React from "react";
import "./Contact2.css";

const CeoFounderTeam = () => {
  const teamMembers = [
    {
      name: "John Doe",
      role: "CEO & Founder",
      bio: "John is the visionary behind Shiksha, with over 20 years of experience in education technology. He founded the company to revolutionize online learning.",
      email: "john.doe@shiksha.com",
      phone: "+91 98765 43210",
      image: "https://via.placeholder.com/80?text=JD"
    }
  ];

  return (
    <div className="contact2-container">
      <header className="contact2-header">
        <h1>CEO and Founder Team</h1>
        <p>Meet our leadership team driving the vision of Shiksha.</p>
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

export default CeoFounderTeam;
