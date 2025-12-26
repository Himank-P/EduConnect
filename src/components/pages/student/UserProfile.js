import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-profile-full`);
        if (!response.ok) {
          throw new Error('Failed to fetch user profile.');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (isLoading) {
    return <div className="page-container">Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="page-container">Could not load profile data.</div>;
  }

  const { user, personalDetails, academicDetails, contactDetails } = profileData;

  return (
    <div className="page-container profile-page-container">
      <div className="profile-page-header">
        <img src={user.imageUrl} alt="User Avatar" className="profile-page-avatar" />
        <div className="profile-page-title">
          <h1>{user.name}</h1>
          <p>{user.id} | {user.class}</p>
        </div>
      </div>

      <div className="profile-details-grid">
        {/* Personal Details Card */}
        <div className="dashboard-card">
          <h3>Personal Details</h3>
          {Object.entries(personalDetails).map(([key, value]) => (
            <div className="detail-item" key={key}>
              <span>{key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        {/* Academic Details Card */}
        <div className="dashboard-card">
          <h3>Academic Details</h3>
          {Object.entries(academicDetails).map(([key, value]) => (
            <div className="detail-item" key={key}>
              <span>{key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        {/* Contact Details Card */}
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

export default UserProfile;

