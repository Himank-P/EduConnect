import React, { useState, useEffect } from 'react';
import StudentAdminModal from '../../ui/modals/StudentAdminModal';

function StudentsAdmin() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/students`);
                if (!response.ok) throw new Error('Failed to fetch student records.');
                const data = await response.json();

                if (Array.isArray(data)) {
                    setStudents(data);
                } else if (typeof data === 'object' && data !== null) {
                    setStudents(Object.values(data)); 
                } else {
                    throw new Error("Received unexpected data format from server.");
                }

            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="page-container">Loading Student Records...</div>;
    if (error) return <div className="page-container"><p style={{color: 'red'}}>{error}</p></div>;

    return (
        <>
            <div className="page-container">
                <h1>🧑‍🎓 Student Records</h1>
                <p className="page-intro">A complete list of all students enrolled. Click a student to view details.</p>
                <div className="dashboard-card">
                    <div className="table-container">
                        <table className="history-table student-list-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th>Fee Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} onClick={() => setSelectedStudent(student.id)}>
                                        <td>{student.id}</td>
                                        <td>{student.name}</td>
                                        <td>{student.class}</td>
                                        <td><span className={`status ${student.feeStatus === 'Paid' ? 'status-paid' : 'status-pending'}`}>{student.feeStatus}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {selectedStudent && <StudentAdminModal studentId={selectedStudent} closeModal={() => setSelectedStudent(null)} />}
        </>
    );
}

export default StudentsAdmin;

