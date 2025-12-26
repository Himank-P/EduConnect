import React from 'react';
import { useAuth } from '../context/AuthContext';

import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import SchoolDashboard from './SchoolDashboard';

function Dashboard() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'school':
      return <SchoolDashboard />;
    default:
      return (
        <div className="page-container">
          <h1>Access Denied</h1>
          <p>You must be logged in to view the dashboard.</p>
        </div>
      );
  }
}

export default Dashboard;

