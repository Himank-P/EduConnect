import React from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <div className="page-container register-container">
      <h1>Join EduConnect</h1>
      <p>Choose your role to create an account and get started.</p>
      
      <div className="role-selection-grid">
        {/* School Registration Card */}
        <Link to="/register/school" className="role-card">
          <div className="role-card-icon">🏫</div>
          <h2>Register as a School</h2>
          <p>Onboard your entire institution to the EduConnect platform.</p>
        </Link>

        {/* Teacher Registration Card */}
        <Link to="/register/teacher" className="role-card">
          <div className="role-card-icon">👩‍🏫</div>
          <h2>Register as a Teacher</h2>
          <p>Manage your classes, attendance, and student records with ease.</p>
        </Link>

        {/* Student Registration Card */}
        <Link to="/register/student" className="role-card">
          <div className="role-card-icon">🎓</div>
          <h2>Register as a Student</h2>
          <p>Access your dashboard, fees, and connect with the campus.</p>
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
