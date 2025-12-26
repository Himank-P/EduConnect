import React, { useState, useEffect } from 'react';

const EventItem = ({ item }) => (
  <div className="campus-life-item">
    <div className="item-header">
      <span className={`item-tag ${item.type.toLowerCase()}`}>{item.type}</span>
      <span className="item-date">Posted on: {new Date().toLocaleDateString()}</span>
    </div>
    <div className="item-content">
      <h4>{item.title}</h4>
      <p>This is a placeholder description for the update. More details would be available upon clicking.</p>
      <a href="#!" className="item-link">Read More →</a>
    </div>
  </div>
);

function CampusLifePage() {
  const [allActivities, setAllActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isRecLoading, setIsRecLoading] = useState(false);

  useEffect(() => {
    const fetchAllActivities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/campus-life`);
        if (!response.ok) throw new Error('Failed to fetch activities.');
        const data = await response.json();
        setAllActivities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllActivities();
  }, []);

  useEffect(() => {
    if (activeTab === 'For You') {
      const fetchRecommendations = async () => {
        setIsRecLoading(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/student/recommendations`);
          if (!response.ok) throw new Error('Failed to fetch recommendations.');
          const data = await response.json();
          setRecommendations(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsRecLoading(false);
        }
      };
      if (recommendations.length === 0) {
        fetchRecommendations();
      }
    }
  }, [activeTab, recommendations.length]);

  const filteredActivities = allActivities.filter(activity =>
    activeTab === 'All' || activity.type === activeTab
  );

  return (
    <div className="page-container">
      <h1>🎉 Campus Life & Events</h1>
      <p className="page-intro">
        Stay up-to-date with the latest notices, event registrations, and society news from around the campus.
      </p>

      <div className="filter-buttons">
        <button onClick={() => setActiveTab('For You')} className={`for-you-tab ${activeTab === 'For You' ? 'active' : ''}`}>✨ For You</button>
        <button onClick={() => setActiveTab('All')} className={activeTab === 'All' ? 'active' : ''}>All</button>
        <button onClick={() => setActiveTab('Event')} className={activeTab === 'Event' ? 'active' : ''}>Events</button>
        <button onClick={() => setActiveTab('Notice')} className={activeTab === 'Notice' ? 'active' : ''}>Notices</button>
        <button onClick={() => setActiveTab('Society')} className={activeTab === 'Society' ? 'active' : ''}>Societies</button>
      </div>

      <div className="campus-life-full-list">
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : activeTab === 'For You' ? (
          isRecLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            recommendations.map(item => <EventItem key={item.id} item={item} />)
          )
        ) : (
          filteredActivities.map(item => <EventItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}

export default CampusLifePage;
