import React, { useState, useEffect } from 'react';

function PlacementsAdmin() {
    // **FIX:** Initialize state with the correct structure to prevent .filter errors
    const [placementsData, setPlacementsData] = useState({ placements: [], hiringCompanies: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/placements`);
                if (!response.ok) throw new Error('Failed to fetch placements data.');
                const data = await response.json();
                setPlacementsData(data);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = React.useMemo(() => {
        const placedStudents = placementsData.placements.filter(p => p.status === 'Placed');
        const totalPackages = placedStudents.reduce((sum, p) => sum + p.packageLPA, 0);
        const averagePackage = totalPackages / placedStudents.length || 0;
        const highestPackage = Math.max(...placedStudents.map(p => p.packageLPA), 0);

        return {
            totalPlaced: placedStudents.length,
            companiesHiring: placementsData.hiringCompanies.filter(c => c.status === 'Actively Hiring').length,
            averagePackage: averagePackage.toFixed(1),
            highestPackage: highestPackage,
        };
    }, [placementsData]);

    if (isLoading) return <div className="page-container">Loading Placements Data...</div>;
    if (error) return <div className="page-container"><p style={{color: 'red'}}>{error}</p></div>;

    return (
        <div className="page-container">
            <h1>🏆 Placements Overview</h1>
            <p className="page-intro">Track ongoing placements, hiring companies, and student success.</p>
            
            <div className="summary-grid admin-kpi-grid">
                <div className="summary-card">
                    <div className="summary-value">{stats.totalPlaced}</div>
                    <div className="summary-label">Students Placed</div>
                </div>
                <div className="summary-card">
                    <div className="summary-value">{stats.companiesHiring}</div>
                    <div className="summary-label">Companies Hiring</div>
                </div>
                 <div className="summary-card">
                    <div className="summary-value">{stats.averagePackage} LPA</div>
                    <div className="summary-label">Average Package</div>
                </div>
                <div className="summary-card">
                    <div className="summary-value">{stats.highestPackage} LPA</div>
                    <div className="summary-label">Highest Package</div>
                </div>
            </div>

            <div className="admin-section">
                <h2>Placed Students</h2>
                <div className="table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Company</th>
                                <th>Package (LPA)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {placementsData.placements.map(p => (
                                <tr key={p.id}>
                                    <td>{p.studentName}</td>
                                    <td>{p.company}</td>
                                    <td><strong>{p.packageLPA}</strong></td>
                                    <td><span className="status status-paid">{p.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="admin-section">
                <h2>Hiring Companies</h2>
                <div className="table-container">
                     <table className="history-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Roles Offered</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {placementsData.hiringCompanies.map(c => (
                                <tr key={c.name}>
                                    <td><strong>{c.name}</strong></td>
                                    <td>{c.roles.join(', ')}</td>
                                    <td>
                                        <span className={`status ${c.status === 'Actively Hiring' ? 'status-paid' : 'status-pending'}`}>
                                            {c.status}
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

export default PlacementsAdmin;

