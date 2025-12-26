import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LibraryAdmin() {
    const [libraryData, setLibraryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/library`);
                if (!response.ok) throw new Error('Failed to fetch library data.');
                const data = await response.json();
                setLibraryData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="page-container">Loading Library Data...</div>;
    if (error) return <div className="page-container"><p style={{color: 'red'}}>{error}</p></div>;
    if (!libraryData) return <div className="page-container">No library data found.</div>;

    return (
        <div className="page-container">
            <h1>📚 Library Management</h1>
            <p className="page-intro">Monitor book issuance, staff, and resource usage.</p>
            
            <div className="summary-grid admin-kpi-grid">
                <div className="summary-card">
                    <div className="summary-value">{libraryData.staff.librarian}</div>
                    <div className="summary-label">Librarian</div>
                </div>
                <div className="summary-card">
                    <div className="summary-value">{libraryData.books.availableCount.toLocaleString()}</div>
                    <div className="summary-label">Books Available</div>
                </div>
                 <div className="summary-card">
                    <div className="summary-value">{libraryData.consumption.power}</div>
                    <div className="summary-label">Power Usage</div>
                </div>
            </div>
            
            <div className="admin-section">
                <h2>Rented Books</h2>
                 <Link to="/admin/library/books" className="admin-action-button">View All Books Catalog</Link>
                <div className="table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Issued To</th>
                                <th>Due Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {libraryData.books.rented.map(book => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.student}</td>
                                    <td>{book.dueDate}</td>
                                    <td>
                                        <span className={`status ${book.status === 'Issued' ? 'status-paid' : 'status-pending'}`}>
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

export default LibraryAdmin;

