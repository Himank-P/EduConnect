import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LibraryCard() {
  const [libraryData, setLibraryData] = useState({ issuedBooks: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/student/library`)
      .then(res => res.json())
      .then(data => {
        setLibraryData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch library data", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-card library-card">
      <h3>📚 Library Status</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="issued-books-list">
            {libraryData.issuedBooks && libraryData.issuedBooks.length > 0 ? (
              libraryData.issuedBooks.map(book => (
                <div className="info-item" key={book.id}>
                  <span>{book.title}</span>
                  <span className="info-meta">Return by: {book.returnDate}</span>
                </div>
              ))
            ) : (
              <p>No books currently issued.</p>
            )}
          </div>
          <Link to="/library-catalog" className="card-link-button">View Full Catalog →</Link>
        </>
      )}
    </div>
  );
}

export default LibraryCard;

