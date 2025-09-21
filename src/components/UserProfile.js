import React from 'react';

function UserProfile() {
  // Sample data for a complete user profile
  const userProfileData = {
    name: 'Rohan Sharma',
    id: 'STU-12345',
    class: '12th Grade - Section A',
    imageUrl: 'https://placehold.co/150x150/ecf5ff/3498db?text=RS',
    personalDetails: {
      'Date of Birth': '15 Aug 2007',
      'Gender': 'Male',
      'Nationality': 'Indian',
    },
    academicDetails: {
      'Admission Date': '01 Apr 2022',
      'Current Session': '2025-2026',
      'Overall Percentage': '92%',
    },
    contactDetails: {
      'Email Address': 'rohan.sharma@educonnect.app',
      'Phone Number': '+91 98765 43210',
      'Address': 'A-123, Sector 62, Noida, Uttar Pradesh 201301',
    }
  };

  return (
    <div className="page-container profile-page-container">
      <div className="profile-page-header">
        <img src={userProfileData.imageUrl} alt="User Avatar" className="profile-page-avatar" />
        <div className="profile-page-title">
          <h1>{userProfileData.name}</h1>
          <p>{userProfileData.id} | {userProfileData.class}</p>
        </div>
      </div>

      <div className="profile-details-grid">
        {/* Personal Details Card */}
        <div className="dashboard-card">
          <h3>Personal Details</h3>
          {Object.entries(userProfileData.personalDetails).map(([key, value]) => (
            <div className="detail-item" key={key}>
              <span>{key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        {/* Academic Details Card */}
        <div className="dashboard-card">
          <h3>Academic Details</h3>
          {Object.entries(userProfileData.academicDetails).map(([key, value]) => (
            <div className="detail-item" key={key}>
              <span>{key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        {/* Contact Details Card */}
        <div className="dashboard-card">
          <h3>Contact Information</h3>
          {Object.entries(userProfileData.contactDetails).map(([key, value]) => (
            <div className="detail-item" key={key}>
              <span>{key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
