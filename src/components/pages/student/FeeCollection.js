import React, { useState, useEffect } from 'react';

function FeeCollection() {
  const [feeDetails, setFeeDetails] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/fees`)
      .then(res => res.json())
      .then(data => {
        setFeeDetails(data.details);
        setPaymentHistory(data.history);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch fee data", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="page-container">Loading fee details...</div>;
  }

  return (
    <div className="page-container">
      <h1>💳 Fee Collection</h1>
      <p className="page-intro">Review your fee summary, payment history, and proceed with online payment.</p>
      
      {feeDetails && (
        <div className="fee-layout">
          <div className="fee-payment-card">
            <h3>Current Invoice</h3>
            <div className="invoice-details">
              <div className="detail-item">
                <span>Invoice ID</span>
                <strong>{feeDetails.invoiceId}</strong>
              </div>
              <div className="detail-item">
                <span>Due Date</span>
                <strong>{feeDetails.dueDate}</strong>
              </div>
            </div>
            <div className="amount-due">
              <span>Amount Due</span>
              <div className="amount">₹{feeDetails.totalDue}</div>
            </div>
            <button className="form-button pay-now-btn">Proceed to Payment</button>
          </div>

          <div className="dashboard-card payment-history-card">
            <h3>Payment History</h3>
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map(payment => (
                    <tr key={payment.id}>
                      <td data-label="Transaction ID">{payment.id}</td>
                      <td data-label="Date">{payment.date}</td>
                      <td data-label="Method">{payment.method}</td>
                      <td data-label="Amount">₹{payment.amount}</td>
                      <td data-label="Status"><span className="status status-paid">{payment.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeeCollection;

