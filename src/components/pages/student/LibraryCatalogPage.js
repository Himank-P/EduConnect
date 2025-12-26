import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LibraryCatalogPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Add state for handling errors

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/library-catalog`);
        if (!response.ok) {
          throw new Error('Failed to fetch the library catalog.');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (isLoading) {
    return <div className="page-container">Loading book catalog...</div>;
  }
  
  if (error) {
    return <div className="page-container"><p style={{color: 'red'}}>{error}</p></div>;
  }

  return (
    <div className="page-container">
      <h1>📚 Library Catalog</h1>
      <Link to="/dashboard" className="back-link-button">← Back to Dashboard</Link>
      <p className="page-intro" style={{marginTop: '20px'}}>
        A complete list of all books available in the library.
      </p>
      <div className="dashboard-card">
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <span className={`book-status ${book.status.toLowerCase()}`}>
                      {book.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LibraryCatalogPage;

