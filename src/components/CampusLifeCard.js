import React from 'react';

function CampusLifeCard() {
  const campusLifeData = [
    { id: 1, type: 'Event', title: 'Annual Tech Fest "Innovate 2025" Registrations Open' },
    { id: 2, type: 'Notice', title: 'Library hours extended during upcoming exams.' },
    { id: 3, type: 'Society', title: 'Update: Photography Club meeting at 4 PM today.' },
  ];

  return (
    <div className="dashboard-card campus-life-card">
      <h3>🎉 Campus Life & Events</h3>
      <ul className="campus-life-list">
        {campusLifeData.map(item => (
          <li key={item.id}>
            <span className={`item-tag ${item.type.toLowerCase()}`}>{item.type}</span>
            <a href="#!">{item.title}</a>
          </li>
        ))}
      </ul>
       <a href="#!" className="card-link-button view-all">View All Updates →</a>
    </div>
  );
}

export default CampusLifeCard;
