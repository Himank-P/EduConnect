import React from 'react';

// Sample feature data
const featureList = [
    { icon: '🌐', title: 'Alumni Portal', description: 'Engage and connect with your institution\'s alumni network.' },
    { icon: '👁️', title: 'AR Campus View', description: 'Interactive Augmented Reality tours of the campus and labs.' },
    { icon: '💳', title: 'Fee Collection', description: 'Seamless online fee payments and financial records.' },
    { icon: '🛏️', title: 'Hostel Allocation', description: 'Streamline the process of allocating hostel rooms to students.'},
    { icon: '📈', title: 'Student Records', description: 'Maintain a centralized database of all student information.'},
    { icon: '📢', title: 'Notice Boards', description: 'Broadcast important notices and updates to all stakeholders.'}
];

function Features() {
  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Everything You Need in One Place</h2>
        <p className="section-subtitle">
            Our platform is built with a modular approach, allowing you to enable and customize the features that matter most to your institution.
        </p>
        <div className="features-grid">
          {featureList.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;

