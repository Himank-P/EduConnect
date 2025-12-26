import React, { useState, useEffect } from 'react';
import TeacherAdminModal from '../../ui/modals/TeacherAdminModal';

function TeachersAdmin() {
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/teachers`);
                if (!response.ok) throw new Error('Failed to fetch teacher records.');
                const data = await response.json();

                // **FIX:** Check if the data is an object and convert it to an array
                if (Array.isArray(data)) {
                    setTeachers(data);
                } else if (typeof data === 'object' && data !== null) {
                    setTeachers(Object.values(data));
                } else {
                    throw new Error("Received unexpected data format from server.");
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="page-container">Loading Teacher Records...</div>;
    if (error) return <div className="page-container"><p style={{color: 'red'}}>{error}</p></div>;

    return (
        <>
            <div className="page-container">
                <h1>👩‍🏫 Teacher Records</h1>
                <p className="page-intro">A complete list of all teaching staff.</p>
                <div className="dashboard-card">
                    <div className="table-container">
                        <table className="history-table student-list-table">
                            <thead>
                                <tr>
                                    <th>Teacher ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Salary Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map(teacher => (
                                    <tr key={teacher.id} onClick={() => setSelectedTeacher(teacher.id)}>
                                        <td>{teacher.id}</td>
                                        <td>{teacher.name}</td>
                                        <td>{teacher.department}</td>
                                        <td><span className={`status ${teacher.salaryStatus === 'Paid' ? 'status-paid' : 'status-pending'}`}>{teacher.salaryStatus}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {selectedTeacher && <TeacherAdminModal teacherId={selectedTeacher} closeModal={() => setSelectedTeacher(null)} />}
        </>
    );
}

export default TeachersAdmin;

