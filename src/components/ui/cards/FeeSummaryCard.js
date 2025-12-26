import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FeeSummaryCard() {
  const [feeDetails, setFeeDetails] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/fee-summary`)
      .then(res => res.json())
      .then(data => setFeeDetails(data.details))
      .catch(err => console.error("Failed to fetch fee summary", err));
  }, []);

  if (!feeDetails) {
    return (
        <div className="dashboard-card fee-summary-card">
            <h3>💳 Fee Summary</h3>
            <p>Loading details...</p>
        </div>
    );
  }

  return (
    <div className="dashboard-card fee-summary-card">
      <h3>💳 Fee Summary</h3>
      <div className="fee-amount">
        <span className="currency-symbol">₹</span>
        {feeDetails.totalDue}
      </div>
      <div className="fee-status">
        <span className="status status-pending">
          Pending
        </span>
      </div>
      <p className="due-date">Next Due Date: {feeDetails.dueDate}</p>
      <Link to="/fees" className="form-button">View Details & Pay</Link>
    </div>
  );
}

export default FeeSummaryCard;

