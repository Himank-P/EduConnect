import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext'; // 1. Import useAuth to know who is logged in

function DataTransfer() {
  const { user } = useAuth(); // 2. Get the logged-in user
  const [students, setStudents] = useState([]);
  const [registeredSchools, setRegisteredSchools] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [dataPackage, setDataPackage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [studentsRes, schoolsRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_API_URL}/api/admin/students`),
                fetch(`${process.env.REACT_APP_API_URL}/api/admin/registered-schools`)
            ]);
            const studentsData = await studentsRes.json();
            const schoolsData = await schoolsRes.json();
            
            setStudents(Array.isArray(studentsData) ? studentsData : Object.values(studentsData));
            
            // **FIX:** Filter out the admin's own school from the list
            if (Array.isArray(schoolsData) && user) {
                setRegisteredSchools(schoolsData.filter(school => school.email !== user.email));
            } else {
                setRegisteredSchools(Array.isArray(schoolsData) ? schoolsData : Object.values(schoolsData));
            }
        } catch (err) {
            console.error("Failed to fetch initial data", err);
        }
    };
    fetchData();
  }, [user]); 

  const handleGeneratePackage = async () => {
    if (!selectedStudentId) { alert("Please select a student first."); return; }
    setIsLoading(true);
    setDataPackage(null);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/student-data-package/${selectedStudentId}`);
      if (!response.ok) throw new Error('Failed to generate data package.');
      const data = await response.json();
      setDataPackage(data);
      setSuccess(`Package for ${data.studentDetails.name} generated.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!dataPackage) return;
    const jsonString = JSON.stringify(dataPackage, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${dataPackage.studentDetails.name.replace(' ', '_')}_TransferPackage.json`;
    link.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            setIsImporting(true);
            setError(null);
            setSuccess(null);
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/import-student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(importedData)
            });
            
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            setSuccess(result.message);

        } catch (err) {
            setError(`Import failed: ${err.message}`);
        } finally {
            setIsImporting(false);
        }
    };
    reader.readAsText(file);
  };

  const handleDirectTransfer = () => {
      if (!selectedStudentId || !selectedSchoolId) {
          alert("Please select both a student and a destination school.");
          return;
      }
      setIsTransferring(true);
      setError(null);
      setSuccess(null);

      setTimeout(() => {
          const studentName = students.find(s => s.id.toString() === selectedStudentId)?.name;
          const schoolName = registeredSchools.find(s => s.id.toString() === selectedSchoolId)?.schoolName;
          setSuccess(`Data for ${studentName} successfully sent to ${schoolName}. (Note: In a real app, this student would now be archived.)`);
          setIsTransferring(false);
          setSelectedStudentId('');
          setSelectedSchoolId('');
      }, 1500);
  };

  return (
    <div className="page-container">
      <h1>Student Data Transfer</h1>
      <p className="page-intro">
        Export, import, or directly transfer student data to another registered institution.
      </p>

      <div className="generator-card">
        <h3>1. Export Student Data Package</h3>
        <div className="transfer-controls">
          <select 
            className="transfer-select" 
            value={selectedStudentId} 
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            <option value="" disabled>-- Select a student --</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name} ({student.id})</option>
            ))}
          </select>
          <button 
            className="form-button" 
            onClick={handleGeneratePackage} 
            disabled={isLoading || !selectedStudentId}
          >
            {isLoading ? 'Generating...' : 'Generate Package'}
          </button>
        </div>
        {dataPackage && (
            <button className="export-button csv" onClick={handleDownload} style={{marginTop: '15px'}}>
                Download Package for {dataPackage.studentDetails.name}
            </button>
        )}
      </div>

      <div className="generator-card">
        <h3>2. Import Student Data Package</h3>
        <p>Upload a `.json` transfer package to add a new student to the system.</p>
        <input 
            type="file" 
            className="file-input" 
            accept="application/json" 
            onChange={handleFileUpload}
            disabled={isImporting}
        />
        {isImporting && <div className="loading-spinner" style={{marginTop: '20px'}}></div>}
      </div>

      <div className="generator-card">
        <h3>3. Direct School-to-School Transfer (Simulation)</h3>
        <p>Select a student and a registered school to initiate a direct data transfer.</p>
        <div className="transfer-controls">
          <select 
            className="transfer-select"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            <option value="" disabled>-- Select student to transfer --</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name} ({student.id})</option>
            ))}
          </select>
          <select 
            className="transfer-select"
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
          >
            <option value="" disabled>-- Select destination school --</option>
            {registeredSchools.map(school => (
              <option key={school.id} value={school.id}>{school.schoolName}</option>
            ))}
          </select>
          <button 
            className="form-button" 
            onClick={handleDirectTransfer} 
            disabled={isTransferring || !selectedStudentId || !selectedSchoolId}
          >
            {isTransferring ? 'Transferring...' : 'Initiate Transfer'}
          </button>
        </div>
      </div>

      {success && <div className="success-message" style={{marginTop: '20px'}}>{success}</div>}
      {error && <div className="error-message" style={{marginTop: '20px'}}>Error: {error}</div>}
      
    </div>
  );
}

export default DataTransfer;

