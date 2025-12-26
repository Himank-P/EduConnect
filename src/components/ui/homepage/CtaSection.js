import React from 'react';
import { Link } from 'react-router-dom';

function CtaSection() {
  return (
    <section className="cta-section">
      <div className="container">
        <h2>Ready to Modernize Your Campus?</h2>
        <p>Join hundreds of institutions revolutionizing their management with EduConnect.</p>
        <Link to="/register" className="hero-button primary">Get Started Now</Link>
      </div>
    </section>
  );
}

export default CtaSection;

