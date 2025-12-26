import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LibraryBooks() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/library`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.books.availableBooks);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="page-container">Loading book catalog...</div>;

  return (
    <div className="page-container">
      <h1>Available Books</h1>
      <p className="page-intro">
        A list of all available books in the library catalog.
        <Link to="/admin/library" class="back-link-button" style={{display: 'block', marginTop: '10px'}}>← Back to Library Management</Link>
      </p>
      <div className="dashboard-card">
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LibraryBooks;
