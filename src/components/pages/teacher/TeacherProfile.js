import React, { useState, useEffect } from 'react';

function TeacherProfile() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/teacher/profile-full`)
      .then(res => res.json())
      .then(data => {
        setProfileData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch teacher profile", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !profileData) {
    return <div className="page-container">Loading profile...</div>;
  }

  const { profile, personalDetails, contactDetails, subjectsTaught } = profileData;

  return (
    <div className="page-container profile-page-container">
      <div className="profile-page-header">
        <img src={profile.imageUrl} alt="User Avatar" className="profile-page-avatar" />
        <div className="profile-page-title">
          <h1>{profile.name}</h1>
          <p>{profile.id} | {profile.department}</p>
        </div>
      </div>

      <div className="profile-details-grid">
        <div className="dashboard-card">
          <h3>Personal & Professional Details</h3>
          {Object.entries(personalDetails).map(([key, value]) => (
            <div className="detail-item" key={key}>
              <span>{key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="dashboard-card">
          <h3>Subjects Taught</h3>
          <ul className="subjects-list">
            {subjectsTaught.map((subject, index) => (
                <li key={index}>{subject}</li>
            ))}
          </ul>
        </div>
        <div className="dashboard-card">
          <h3>Contact Information</h3>
          {Object.entries(contactDetails).map(([key, value]) => (
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

export default TeacherProfile;
