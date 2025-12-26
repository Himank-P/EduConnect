import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-content">
        <div className="hero-text">
          <h1 className="hero-heading">The Smart, Low-Cost ERP Your College Already Owns</h1>
          <p className="hero-subheading">
            Stop juggling separate ledgers. EduConnect intelligently connects familiar cloud apps like Google Forms and Sheets into a cohesive, real-time campus management system.
          </p>
          <div className="hero-buttons">
            <a href="#why-edu-connect" className="hero-button primary">Learn More</a>
            <Link to="/register/school" className="hero-button secondary">Onboard Your School</Link>
          </div>
        </div>
        <div className="hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop" 
            alt="EduConnect Platform Showcase" 
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;

