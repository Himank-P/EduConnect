import React, { useState } from 'react';

// This component is a React translation of the user's provided card design.
function AlumniCard({ alumni }) {
  // State to manage the currently active tab ('about', 'experience', 'contact').
  const [activeTab, setActiveTab] = useState('about');
  
  // State to manage if the card header is in its minimized "active" state.
  const [cardIsActive, setCardIsActive] = useState(false);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // The card header minimizes when any tab other than 'about' is selected.
    setCardIsActive(tabName !== 'about');
  };

  return (
    // The main card container's class and data-state change based on state
    <div 
      className={cardIsActive ? "alumni-card is-active" : "alumni-card"}
      data-state={`#${activeTab}`}
    >
      <div className="card-header">
        <div className="card-cover" style={{ backgroundImage: `url(${alumni.imageUrl})` }}></div>
        <img className="card-avatar" src={alumni.imageUrl} alt={`Profile of ${alumni.name}`} />
        <h1 className="card-fullname">{alumni.name}</h1>
        <h2 className="card-jobtitle">{alumni.currentRole}</h2>
      </div>

      <div className="card-main">
        {/* About Section */}
        <div className={activeTab === 'about' ? 'card-section is-active' : 'card-section'} id="about">
          <div className="card-content">
            <div className="card-subtitle">ABOUT</div>
            <p className="card-desc">Working at {alumni.company} in {alumni.location}. A passionate professional from the batch of {alumni.batch}, holding a degree in {alumni.degree}.</p>
          </div>
          <div className="card-social">
            {/* Placeholder social links */}
            <a href="#!"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15.997 3.985h2.191V.169C17.81.117 16.51 0 14.996 0c-3.159 0-5.323 1.987-5.323 5.639V9H6.187v4.266h3.486V24h4.274V13.267h3.345l.531-4.266h-3.877V6.062c.001-1.233.333-2.077 2.051-2.077z" /></svg></a>
            <a href="#!"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M512 97.248c-19.04 8.352-39.328 13.888-60.48 16.576 21.76-12.992 38.368-33.408 46.176-58.016-20.288 12.096-42.688 20.64-66.56 25.408C411.872 60.704 384.416 48 354.464 48c-58.112 0-104.896 47.168-104.896 104.992 0 8.32.704 16.32 2.432 23.936-87.264-4.256-164.48-46.08-216.352-109.792-9.056 15.712-14.368 33.696-14.368 53.056 0 36.352 18.72 68.576 46.624 87.232-16.864-.32-33.408-5.216-47.424-12.928v1.152c0 51.008 36.384 93.376 84.096 103.136-8.544 2.336-17.856 3.456-27.52 3.456-6.72 0-13.504-.384-19.872-1.792 13.6 41.568 52.192 72.128 98.08 73.12-35.712 27.936-81.056 44.768-130.144 44.768-8.608 0-16.864-.384-25.12-1.44C46.496 446.88 101.6 464 161.024 464c193.152 0 298.752-160 298.752-298.688 0-4.64-.16-9.12-.384-13.568 20.832-14.784 38.336-33.248 52.608-54.496z" /></svg></a>
          </div>
        </div>
        
        {/* Experience Section */}
        <div className={activeTab === 'experience' ? 'card-section is-active' : 'card-section'} id="experience">
          <div className="card-content">
            <div className="card-subtitle">EXPERIENCE</div>
            <div className="card-timeline">
              {alumni.experience.map((job, index) => (
                <div className="card-item" data-year={job.years.split('-')[0]} key={index}>
                  <div className="card-item-title">{job.role} at <span>{job.company}</span></div>
                  <div className="card-item-desc">{job.years}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className={activeTab === 'contact' ? 'card-section is-active' : 'card-section'} id="contact">
          <div className="card-content">
            <div className="card-subtitle">CONTACT</div>
            <div className="card-contact-wrapper">
                <div className="card-contact">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>
                    {/* The email is now a clickable mailto link */}
                    <a href={`mailto:${alumni.contact.email}`}>{alumni.contact.email}</a>
                </div>
                <div className="card-contact">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span>{alumni.location}</span>
                </div>
                <a href={alumni.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-me">
                    CONNECT ON LINKEDIN
                </a>
            </div>
          </div>
        </div>
        
        <div className="card-buttons">
            <button className={activeTab === 'about' ? 'is-active' : ''} onClick={() => handleTabClick('about')}>ABOUT</button>
            <button className={activeTab === 'experience' ? 'is-active' : ''} onClick={() => handleTabClick('experience')}>EXPERIENCE</button>
            <button className={activeTab === 'contact' ? 'is-active' : ''} onClick={() => handleTabClick('contact')}>CONTACT</button>
        </div>
      </div>
    </div>
  );
}

export default AlumniCard;

