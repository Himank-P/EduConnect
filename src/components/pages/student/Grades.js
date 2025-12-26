import React, { useState, useEffect } from 'react';

function Grades() {
  const [gradesData, setGradesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/student/grades`);
        if (!response.ok) {
          throw new Error('Failed to fetch grades data.');
        }
        const data = await response.json();
        setGradesData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="page-container">Loading grades...</div>;
  if (error) return <div className="page-container"><p style={{color: 'red'}}>{error}</p></div>;
  if (!gradesData || !gradesData.midTerm || !gradesData.finalTerm) {
      return <div className="page-container">No grades data available.</div>;
  }

  return (
    <div className="page-container">
      <h1>📝 Grades & Results</h1>
      <p className="page-intro">
        View your academic performance, including marks from various examinations and assignments.
      </p>
      <div className="grades-grid">
        <div className="dashboard-card">
          <h3>Mid-Term Examination Results</h3>
          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {gradesData.midTerm.map((result, index) => (
                  <tr key={index}>
                    <td data-label="Subject">{result.subject}</td>
                    <td data-label="Marks Obtained">{result.marks}</td>
                    <td data-label="Grade">{result.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="dashboard-card">
          <h3>Final Term Examination Results</h3>
           <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {gradesData.finalTerm.map((result, index) => (
                  <tr key={index}>
                    <td data-label="Subject">{result.subject}</td>
                    <td data-label="Marks Obtained">{result.marks}</td>
                    <td data-label="Grade">{result.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Grades;