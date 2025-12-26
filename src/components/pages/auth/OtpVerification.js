import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function OtpVerification() {
  const { userType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      alert("No email found. Please start registration again.");
      navigate('/register');
    }
  }, [location, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if(enteredOtp.length < 6) {
        alert("Please enter the complete 6-digit OTP.");
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp: enteredOtp }),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error);
        }

        alert(result.message);
        
        // Redirect to the correct onboarding form based on user type
        navigate(`/onboarding/${userType}`, { state: { email } });

    } catch (error) {
        alert(`Verification failed: ${error.message}`);
    }
  };

  return (
    <div className="page-container form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>OTP Verification</h2>
          <p>An OTP has been sent to <strong>{email}</strong>.</p>
          <p>Please enter the 6-digit code below.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="otp-group">
            {otp.map((data, index) => (
              <input
                className="otp-input"
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
              />
            ))}
          </div>
          <button type="submit" className="form-button">Verify Account</button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;

