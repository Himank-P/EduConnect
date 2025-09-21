import React from 'react';

function LibraryCard() {
  const libraryData = {
    issuedBook: 'The Principles of Physics',
    returnDate: '05 Oct 2025',
  };

  return (
    <div className="dashboard-card library-card">
      <h3>📚 Library Status</h3>
      <div className="info-item">
        <span>Currently Issued:</span>
        <span className="info-meta bold">{libraryData.issuedBook}</span>
      </div>
      <div className="info-item">
        <span>Return Due Date:</span>
        <span className="info-meta">{libraryData.returnDate}</span>
      </div>
      <a href="#!" className="card-link-button">Search Catalog →</a>
    </div>
  );
}

export default LibraryCard;
