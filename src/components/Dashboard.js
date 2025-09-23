import React from 'react';
import { Link } from 'react-router-dom';
import LibraryCard from './LibraryCard';
import HostelCard from './HostelCard';
import CampusLifeCard from './CampusLifeCard';
import AbcCard from './AbcCard';
import FeeSummaryCard from './FeeSummaryCard';
import ExtracurricularsCard from './ExtracurricularsCard'; // 1. Import the card

function Dashboard() {
  // Sample data
  const userData = {
    name: 'Rohan Sharma',
    id: 'STU-12345',
    class: '12th Grade - Section A',
    attendance: '92%',
  };

  const schoolData = {
      address: '123 Education Lane, Knowledge Park, New Delhi, Delhi 110001',
      phone: '+91 11 2345 6789',
      email: 'contact@educonnectschool.edu.in'
  };

  return (
    <div className="page-container dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Welcome, {userData.name}!</h1>
        <p>Here is your summary for today, {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        
        <div className="dashboard-card profile-card">
           <div className="profile-header">
             <img src="https://placehold.co/100x100/ecf5ff/3498db?text=RS" alt="Profile" className="profile-avatar" />
             <div className="profile-info">
               <h3>{userData.name}</h3>
               <p>{userData.id} | {userData.class}</p>
             </div>
           </div>
           <div className="profile-details">
                <div className="detail-item">
                    <span>Email</span>
                    <strong>rohan.sharma@educonnect.app</strong>
                </div>
                <div className="detail-item">
                    <span>Assignments Due</span>
                    <strong>3</strong>
                </div>
           </div>
           <div className="attendance-summary">
             <div className="progress-label">
                <span>Overall Attendance</span>
                <strong>{userData.attendance}</strong>
             </div>
             <div className="progress-bar">
                <div className="progress-fill" style={{width: userData.attendance}}></div>
             </div>
           </div>
            <div className="profile-footer">
                <Link to="/profile" className="card-link-button">View Full Profile</Link>
            </div>
        </div>

        <div className="dashboard-card quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/attendance"><span>📚</span> View Attendance</Link></li>
            <li><Link to="/grades"><span>📝</span> Check Grades</Link></li>
            <li><Link to="/fees"><span>💳</span> Fee History</Link></li>
            <li><Link to="/timetable"><span>🗓️</span> View Timetable</Link></li>
          </ul>
        </div>
        
        <FeeSummaryCard />
        <ExtracurricularsCard /> {/* 2. Add the card to the grid */}
        <LibraryCard />
        <HostelCard />
        <CampusLifeCard />
        <AbcCard />

        <div className="dashboard-card contact-school-card">
            <h3>📍 Contact School</h3>
            <div className="map-container">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112073.64340578811!2d77.15546255169993!3d28.62095898851086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1726854743481!5m2!1sen!2sin" 
                    width="100%" 
                    height="150" 
                    style={{ border: 0 }}
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="School Location"
                ></iframe>
            </div>
            <div className="contact-details">
                <p className="contact-info"><strong>Address:</strong> {schoolData.address}</p>
                <p className="contact-info"><strong>Phone:</strong> <a href={`tel:${schoolData.phone}`}>{schoolData.phone}</a></p>
                <p className="contact-info"><strong>Email:</strong> <a href={`mailto:${schoolData.email}`}>{schoolData.email}</a></p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

