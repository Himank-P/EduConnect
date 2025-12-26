import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SchoolDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`);
        if (!response.ok) {
          throw new Error('Failed to fetch admin dashboard data.');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch admin dashboard", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="page-container">Loading Admin Dashboard...</div>;
  }

  if (error) {
    return <div className="page-container"><p style={{color: 'red'}}>Error: {error}</p></div>;
  }

  if (!dashboardData) {
      return <div className="page-container">No dashboard data available.</div>;
  }

  return (
    <div className="page-container dashboard-container">
      <div className="dashboard-header">
        <h1>Administrator Dashboard</h1>
        <p>A high-level overview of your institution's key metrics.</p>
      </div>
      
      <div className="summary-grid admin-kpi-grid">
        <div className="summary-card">
          <div className="summary-value">{dashboardData.totalStudents}</div>
          <div className="summary-label">Total Students</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{dashboardData.totalStaff}</div>
          <div className="summary-label">Total Staff</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{dashboardData.feeCollectionPercentage}%</div>
          <div className="summary-label">Fee Collection</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{dashboardData.resourceConsumption.electricity}</div>
          <div className="summary-label">Power Usage Today</div>
        </div>
      </div>

      <div className="admin-nav-grid">
        <Link to="/admin/students" className="admin-nav-card"><span>🧑‍🎓</span> Students</Link>
        <Link to="/admin/teachers" className="admin-nav-card"><span>👩‍🏫</span> Teachers</Link>
        <Link to="/admin/staff" className="admin-nav-card"><span>👥</span> Other Staff</Link>
        <Link to="/admin/finances" className="admin-nav-card"><span>💰</span> Finances</Link>
        <Link to="/admin/transport" className="admin-nav-card"><span>🚌</span> Transport</Link>
        <Link to="/admin/hostel" className="admin-nav-card"><span>🛏️</span> Hostel</Link>
        <Link to="/admin/library" className="admin-nav-card"><span>📚</span> Library</Link>
        <Link to="/admin/placements" className="admin-nav-card"><span>🏆</span> Placements</Link>
        <Link to="/admin/timetable-generator" className="admin-nav-card"><span>⚙️</span> Timetable Generator</Link>
        <Link to="/admin/complaints" className="admin-nav-card"><span>🗳️</span> Complaints Log</Link>
        <Link to="/admin/labs" className="admin-nav-card"><span>🔬</span> Lab Inventory</Link>
        <Link to="/admin/data-transfer" className="admin-nav-card"><span>📤</span> Data Transfer</Link>

      </div>
    </div>
  );
}

export default SchoolDashboard;

