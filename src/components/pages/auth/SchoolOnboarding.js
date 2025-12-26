import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function SchoolOnboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [schoolName, setSchoolName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [schoolBoard, setSchoolBoard] = useState('');
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = location.state?.email || 'your school';

  const handleComplete = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/onboarding/school`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, schoolName, phone, address, principalName, schoolBoard, website, password }),
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
          <h2>Complete School Profile</h2>
          <p>Please provide the final details for {email}.</p>
        </div>
        <form onSubmit={handleComplete} className="auth-form">
          <div className="form-group">
            <label htmlFor="schoolName">Official School Name</label>
            <input 
              type="text" 
              id="schoolName" 
              value={schoolName} 
              onChange={(e) => setSchoolName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="principalName">Principal's Name</label>
            <input 
              type="text" 
              id="principalName" 
              value={principalName} 
              onChange={(e) => setPrincipalName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Contact Number</label>
            <input 
              type="tel" 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>
           <div className="form-group">
            <label htmlFor="address">Address</label>
            <input 
              type="text" 
              id="address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
            />
          </div>
           <div className="form-group">
            <label htmlFor="schoolBoard">School Board (e.g., CBSE, ICSE)</label>
            <input 
              type="text" 
              id="schoolBoard" 
              value={schoolBoard} 
              onChange={(e) => setSchoolBoard(e.target.value)} 
              required 
            />
          </div>
           <div className="form-group">
            <label htmlFor="website">Website (Optional)</label>
            <input 
              type="url" 
              id="website" 
              value={website} 
              onChange={(e) => setWebsite(e.target.value)} 
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

export default SchoolOnboarding;

