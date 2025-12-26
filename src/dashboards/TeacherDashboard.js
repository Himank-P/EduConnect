import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeClassCard from '../components/ui/cards/HomeClassCard';
import BusDutyCard from '../components/ui/cards/BusDutyCard';
import BusRosterModal from '../components/ui/modals/BusRosterModal';

function TeacherDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Added for robust error handling
  const [showBusRoster, setShowBusRoster] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/teacher/dashboard`);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data. Please ensure the server is running correctly.');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch teacher dashboard data", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="page-container">Loading Teacher Dashboard...</div>;
  }

  if (error) {
    return <div className="page-container"><p style={{color: 'red'}}>Error: {error}</p></div>;
  }
  
  if (!dashboardData) {
    return <div className="page-container">No dashboard data available.</div>;
  }

  const { profile, salary, timetable, timeSlots, homeClass, busDuty } = dashboardData;

  return (
    <>
      <div className="page-container dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {profile.name}!</h1>
          <p>This is your personalized dashboard.</p>
        </div>

        <div className="dashboard-grid teacher-grid">
          <div className="dashboard-card profile-card">
             <div className="profile-header">
               <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop" alt="Profile" className="profile-avatar" />
               <div className="profile-info">
                 <h3>{profile.name}</h3>
                 <p>{profile.id} | {profile.department}</p>
               </div>
             </div>
             <div className="profile-details">
                  <div className="detail-item">
                      <span>Email</span>
                      <strong>{profile.email || 'priya.singh@edu.app'}</strong>
                  </div>
                  <div className="detail-item">
                      <span>Phone</span>
                      <strong>{profile.phone || '+91 98765 12345'}</strong>
                  </div>
             </div>
             <div className="attendance-summary">
               <div className="progress-label">
                  <span>Your Attendance</span>
                  <strong>{profile.attendance}</strong>
               </div>
               <div className="progress-bar">
                  <div className="progress-fill" style={{width: profile.attendance}}></div>
               </div>
             </div>
             <div className="profile-footer">
                  <Link to="/teacher/profile" className="card-link-button">View Full Profile</Link>
              </div>
          </div>

          <HomeClassCard homeClass={homeClass} />

          <div className="dashboard-card salary-card">
            <h3>💰 Salary Status</h3>
            <div className="info-item">
              <span>Status:</span>
              <span className={`status ${salary.status === 'Paid' ? 'status-paid' : 'status-pending'}`}>{salary.status}</span>
            </div>
            <div className="info-item">
              <span>Last Paid:</span>
              <strong>{salary.lastPaidDate}</strong>
            </div>
             <div className="info-item">
              <span>Next Payout:</span>
              <strong>{salary.nextPayableDate}</strong>
            </div>
          </div>

          <BusDutyCard busDuty={busDuty} onClick={() => setShowBusRoster(true)} />

          <div className="dashboard-card quick-links-teacher">
            <h3>Tools & Actions</h3>
            <ul>
              <li><Link to="/teacher/my-classes"><span>🏫</span> My Classes</Link></li>
              <li><Link to="/teacher/detailed-attendance"><span>📊</span> Detailed Attendance</Link></li>
              <li><Link to="/teacher/upload-marks"><span>📤</span> Upload Marks</Link></li>
              <li><Link to="/teacher/upload-attendance"><span>✔️</span> Upload Attendance</Link></li>
            </ul>
          </div>
          
          <div className="dashboard-card timetable-card">
              <h3>🗓️ Your Timetable</h3>
              <div className="table-container">
                  <table className="history-table timetable">
                      <thead>
                          <tr>
                              <th>Time</th>
                              {Object.keys(timetable).map(day => <th key={day}>{day}</th>)}
                          </tr>
                      </thead>
                      <tbody>
                          {timeSlots.map((time, timeIndex) => (
                              <tr key={time}>
                                  <td>{time}</td>
                                  {Object.keys(timetable).map(day => (
                                      <td key={day} className={timetable[day][timeIndex].subject === 'Break' ? 'break-slot' : ''}>
                                          <div className="timetable-subject">{timetable[day][timeIndex].subject}</div>
                                          <div className="timetable-teacher">{timetable[day][timeIndex].teacher}</div>
                                      </td>
                                  ))}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
        </div>
      </div>
      
      {showBusRoster && <BusRosterModal bus={busDuty} closeModal={() => setShowBusRoster(false)} />}
    </>
  );
}

export default TeacherDashboard;

