import React from 'react';

function WhyEduConnect() {
  return (
    <section className="why-edu-connect">
      <div className="container">
        <h2 className="section-title">Escape the Data Maze</h2>
        <p className="section-subtitle">
          Traditional ERPs are expensive. Manual data entry is slow and error-prone. We offer a better way.
        </p>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h3>Zero Capital Outlay</h3>
            <p>Leverage the cloud office suites you already own. No expensive proprietary software to purchase or maintain.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👍</div>
            <h3>Shallow Learning Curve</h3>
            <p>Built on familiar tools like Forms and Sheets that your administrative staff can use from day one.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔄</div>
            <h3>A Single Source of Truth</h3>
            <p>Unify all your data, from admissions to fees, in one central, secure, and accessible location.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyEduConnect;
