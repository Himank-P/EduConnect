import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // 1. Import useAuth

function TeacherOnboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [fullName, setFullName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = location.state?.email || 'your';

  const handleComplete = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/onboarding/teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName, schoolId, department, phone, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to complete registration.');
      }
      login(result.user);
      navigate('/dashboard');

    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Complete Your Profile</h2>
          <p>Please provide the final details for your teacher account.</p>
        </div>
        <form onSubmit={handleComplete} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="schoolId">School ID / Code</label>
            <input 
              type="text" 
              id="schoolId"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input 
              type="text" 
              id="department" 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Set Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="form-button" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Complete Registration'}
            </button>
        </form>
      </div>
    </div>
  );
}

export default TeacherOnboarding;

