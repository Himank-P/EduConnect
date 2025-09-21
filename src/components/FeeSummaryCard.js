import React from 'react';
import { Link } from 'react-router-dom';

function FeeSummaryCard() {
  const feeDetails = {
    totalDue: '15,000',
    dueDate: '30 Sep 2025',
    status: 'Pending',
  };

  return (
    <div className="dashboard-card fee-summary-card">
      <h3>💳 Fee Summary</h3>
      <div className="fee-amount">
        <span className="currency-symbol">₹</span>
        {feeDetails.totalDue}
      </div>
      <div className="fee-status">
        <span className={`status ${feeDetails.status === 'Pending' ? 'status-pending' : 'status-paid'}`}>
          {feeDetails.status}
        </span>
      </div>
      <p className="due-date">Next Due Date: {feeDetails.dueDate}</p>
      <Link to="/fees" className="form-button">View Details & Pay</Link>
    </div>
  );
}

export default FeeSummaryCard;
