import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; 

function StudentOnboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [dob, setDob] = useState('');
  const [parentName, setParentName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = location.state?.email || 'your';

  const handleComplete = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/onboarding/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName, studentId, dob, parentName, password }),
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
          <p>Please provide the final details for your student account.</p>
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
            <label htmlFor="studentId">Student ID / Roll No.</label>
            <input 
              type="text" 
              id="studentId" 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input 
              type="date" 
              id="dob" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="parentName">Parent/Guardian Name</label>
            <input 
              type="text" 
              id="parentName" 
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
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

export default StudentOnboarding;

