import React from 'react';

function Extracurriculars() {
  // Sample Data
  const activities = [
    { type: 'Club', name: 'Robotics Club', role: 'President', duration: '2024-Present' },
    { type: 'Event', name: 'Inter-School Hackathon 2025', role: 'Participant (1st Place)', duration: 'Aug 2025' },
    { type: 'Society', name: 'Photography Society', role: 'Member', duration: '2023-Present' },
    { type: 'Sport', name: 'Basketball Team', role: 'Team Captain', duration: '2024-Present' },
  ];

  return (
    <div className="page-container">
      <h1>🎨 Extracurricular Activities</h1>
      <p className="page-intro">
        A detailed record of your involvement in clubs, societies, events, and sports.
      </p>
      <div className="activities-list">
        {activities.map((activity, index) => (
          <div className="activity-card" key={index}>
            <div className={`activity-type ${activity.type.toLowerCase()}`}>{activity.type}</div>
            <div className="activity-details">
              <h4>{activity.name}</h4>
              <p><strong>Role:</strong> {activity.role}</p>
              <p><strong>Duration:</strong> {activity.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Extracurriculars;
