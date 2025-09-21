import React from 'react';

function HostelCard() {
  const hostelData = {
    allottedRoom: 'A-207, Boys Hostel 2',
    status: 'Confirmed',
  };

  return (
    <div className="dashboard-card hostel-card">
      <h3>🛏️ Hostel Information</h3>
      <div className="info-item">
        <span>Allotted Room:</span>
        <span className="info-meta bold">{hostelData.allottedRoom}</span>
      </div>
       <div className="info-item">
        <span>Status:</span>
        <span className="status status-paid">{hostelData.status}</span>
      </div>
      <a href="#!" className="card-link-button">Hostel Services →</a>
    </div>
  );
}

export default HostelCard;
