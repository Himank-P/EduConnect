import React, { useState, useEffect } from 'react';
import StaffAdminModal from '../../ui/modals/StaffAdminModal';

function StaffAdmin() {
    const [staff, setStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/staff`);
                if (!response.ok) throw new Error('Failed to fetch staff records.');
                const data = await response.json();
                setStaff(Array.isArray(data) ? data : Object.values(data));
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredStaff = activeTab === 'All' ? staff : staff.filter(s => s.role === activeTab);

    if (isLoading) return <div className="page-container">Loading Staff Records...</div>;
    if (error) return <div className="page-container"><p style={{color: 'red'}}>{error}</p></div>;

    return (
        <>
            <div className="page-container">
                <h1>👥 Other Staff Records</h1>
                <p className="page-intro">A list of all non-teaching staff members.</p>
                <div className="filter-buttons">
                    <button onClick={() => setActiveTab('All')} className={activeTab === 'All' ? 'active' : ''}>All</button>
                    <button onClick={() => setActiveTab('Cleaner')} className={activeTab === 'Cleaner' ? 'active' : ''}>Cleaners</button>
                    <button onClick={() => setActiveTab('Peon')} className={activeTab === 'Peon' ? 'active' : ''}>Peons</button>
                    <button onClick={() => setActiveTab('Guard')} className={activeTab === 'Guard' ? 'active' : ''}>Guards</button>
                    <button onClick={() => setActiveTab('Receptionist')} className={activeTab === 'Receptionist' ? 'active' : ''}>Reception</button>
                    <button onClick={() => setActiveTab('Driver')} className={activeTab === 'Driver' ? 'active' : ''}>Drivers</button>
                    <button onClick={() => setActiveTab('Conductor')} className={activeTab === 'Conductor' ? 'active' : ''}>Conductors</button>
                    <button onClick={() => setActiveTab('Lab Assistant')} className={activeTab === 'Lab Assistant' ? 'active' : ''}>Lab Assistants</button>
                    <button onClick={() => setActiveTab('Admin Office')} className={activeTab === 'Admin Office' ? 'active' : ''}>Admin Office</button>
                </div>
                <div className="dashboard-card">
                    <div className="table-container">
                        <table className="history-table student-list-table">
                            <thead>
                                <tr>
                                    <th>Staff ID</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Shift</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.map(member => (
                                    <tr key={member.id} onClick={() => setSelectedStaff(member.id)}>
                                        <td>{member.id}</td>
                                        <td>{member.name}</td>
                                        <td>{member.role}</td>
                                        <td>{member.shift}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {selectedStaff && <StaffAdminModal staffId={selectedStaff} closeModal={() => setSelectedStaff(null)} />}
        </>
    );
}

export default StaffAdmin;

