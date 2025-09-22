import React from 'react';

function FeeCollection() {
  // Sample data
  const feeDetails = {
    totalDue: '15,000',
    dueDate: '30 Sep 2025',
    invoiceId: 'INV-2025-09-00123'
  };

  const paymentHistory = [
    { id: 'TXN789123', date: '15 Jul 2025', amount: '25,000', status: 'Paid', method: 'Online' },
    { id: 'TXN456789', date: '15 Apr 2025', amount: '25,000', status: 'Paid', method: 'Online' },
    { id: 'TXN123456', date: '15 Jan 2025', amount: '25,000', status: 'Paid', method: 'Bank Transfer' },
  ];

  return (
    <div className="page-container">
      <h1>💳 Fee Collection</h1>
      <p className="page-intro">Review your fee summary, payment history, and proceed with online payment.</p>
      
      <div className="fee-layout">
        
        {/* Fee Payment Card (Left Side) */}
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

        {/* Payment History (Right Side) */}
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
    </div>
  );
}

export default FeeCollection;

