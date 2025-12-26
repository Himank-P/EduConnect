import React, { useState, useEffect } from 'react';
import StudentProfileModal from '../../ui/modals/StudentProfileModal';

function MyClasses() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/teacher/classes`)
      .then(res => res.json())
      .then(data => {
        setClasses(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch class data", err);
        setIsLoading(false);
      });
  }, []);

  // Handlers for the modal remain the same
  const handleStudentClick = (studentId) => { setSelectedStudent(studentId); };
  const closeModal = () => { setSelectedStudent(null); };

  if (isLoading) {
    return <div className="page-container">Loading class information...</div>;
  }

  // A helper function to check if a student has transport data
  const hasTransport = (studentId) => {
      // This is a simplified check. In a real app, you'd fetch this data.
      return studentId.includes('10A');
  };

  return (
    <>
      <div className="page-container">
        <h1>🏫 My Classes</h1>
        <p className="page-intro">An overview of your assigned classes and student rosters. Click a student to see their details.</p>
        <div className="classes-grid">
          {classes.map(cls => (
            <div className="dashboard-card class-card" key={cls.classId}>
              <h3>{cls.className}</h3>
              <p className="class-subject"><strong>Subject:</strong> {cls.subject}</p>
              <h4>Student Roster</h4>
              <ul className="student-roster">
                {cls.students.map(student => (
                  <li key={student.id} onClick={() => handleStudentClick(student.id)}>
                    <span>
                      {student.name}
                      {/* NEW: Add a bus icon if the student uses transport */}
                      {hasTransport(student.id) && <span className="transport-icon">🚌</span>}
                    </span>
                    <span className="student-id">{student.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {selectedStudent && <StudentProfileModal studentId={selectedStudent} closeModal={closeModal} />}
    </>
  );
}

export default MyClasses;

