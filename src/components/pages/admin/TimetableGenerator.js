import React, { useState, useMemo } from 'react';
import TimetableDisplay from '../../ui/TimetableDisplay'; // 1. Import the display component

function TimetableGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedTimetable(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/generate-timetable`, {
        method: 'POST',
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate timetable.');
      }

      setGeneratedTimetable(result.timetable);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW EXPORT LOGIC ---

  // Re-create the teacher timetable structure for exporting
  const teacherTimetables = useMemo(() => {
    if (!generatedTimetable) return {};
    const schedules = {};
    for (const className in generatedTimetable) {
      for (const day in generatedTimetable[className]) {
        generatedTimetable[className][day].forEach(period => {
          const { teacher, subject, time } = period;
          if (teacher && teacher !== 'Break') {
            if (!schedules[teacher]) schedules[teacher] = { Monday: {}, Tuesday: {}, Wednesday: {}, Thursday: {}, Friday: {} };
            schedules[teacher][day][time] = { className, subject };
          }
        });
      }
    }
    return schedules;
  }, [generatedTimetable]);

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const handleExportCSV = () => {
    if (!generatedTimetable) return;

    let csvContent = "Type,Name,Day,Time,Subject/Class,Teacher/Student\n";
    
    // Add Class Timetables
    for (const className in generatedTimetable) {
      for (const day in generatedTimetable[className]) {
        generatedTimetable[className][day].forEach(period => {
          const row = ["Class", `"${className}"`, day, period.time, `"${period.subject}"`, `"${period.teacher}"`].join(",");
          csvContent += row + "\n";
        });
      }
    }

    csvContent += "\n"; // Spacer

    // Add Teacher Timetables
    for (const teacherName in teacherTimetables) {
        for (const day of days) {
            for (const time of timeSlots) {
                const period = teacherTimetables[teacherName][day]?.[time];
                if(period) {
                    const row = ["Teacher", `"${teacherName}"`, day, time, `"${period.subject}"`, `"${period.className}"`].join(",");
                    csvContent += row + "\n";
                }
            }
        }
    }

    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "full_timetable.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportDOC = () => {
    if (!generatedTimetable) return;

    let htmlContent = `<html><head><meta charset='utf-8'><title>Timetables</title><style>body{font-family:Arial;} table{border-collapse:collapse;width:100%;margin-bottom:20px;} th,td{border:1px solid #ddd;padding:8px;} th{background-color:#f2f2f2;}</style></head><body><h1>Generated Timetables</h1>`;

    // Add Class Timetables to DOC
    htmlContent += "<h2>Class Timetables</h2>";
    for (const className in generatedTimetable) {
      htmlContent += `<h3>${className}</h3><table><thead><tr><th>Time</th>${days.map(d => `<th>${d}</th>`).join('')}</tr></thead><tbody>`;
      timeSlots.forEach(time => {
        htmlContent += `<tr><td>${time}</td>`;
        days.forEach(day => {
          const period = generatedTimetable[className][day]?.find(p => p.time === time);
          htmlContent += `<td>${period ? `${period.subject}<br><small>${period.teacher}</small>` : '-'}</td>`;
        });
        htmlContent += '</tr>';
      });
      htmlContent += '</tbody></table>';
    }

    // Add Teacher Timetables to DOC
    htmlContent += "<h2>Teacher Timetables</h2>";
    for (const teacherName in teacherTimetables) {
        htmlContent += `<h3>${teacherName}</h3><table><thead><tr><th>Time</th>${days.map(d => `<th>${d}</th>`).join('')}</tr></thead><tbody>`;
        timeSlots.forEach(time => {
            htmlContent += `<tr><td>${time}</td>`;
            days.forEach(day => {
                const period = teacherTimetables[teacherName][day]?.[time];
                htmlContent += `<td>${period ? `${period.subject}<br><small>${period.className}</small>` : '-'}</td>`;
            });
            htmlContent += '</tr>';
        });
        htmlContent += '</tbody></table>';
    }

    htmlContent += '</body></html>';
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(htmlContent);
    const link = document.createElement("a");
    link.href = url;
    link.download = "full_timetable.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      <h1>⚙️ AI Timetable Generator</h1>
      <p className="page-intro">
        Click the button below to automatically generate a new weekly timetable. You can then export the result.
      </p>

      <div className="generator-card">
        <button className="form-button" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating Timetable...' : 'Generate New Timetable'}
        </button>
      </div>

      {isLoading && <div className="loading-spinner" style={{ marginTop: '30px' }}></div>}
      {error && <div className="error-message" style={{ marginTop: '30px' }}>Error: {error}</div>}

      {generatedTimetable && (
          <div className="admin-section">
            <h2>Generation Successful</h2>
            <p>The timetable has been generated and saved. You can now download it in your preferred format.</p>
            <div className="export-buttons">
                <button className="export-button csv" onClick={handleExportCSV}>Export as CSV</button>
                <button className="export-button doc" onClick={handleExportDOC}>Export as DOC</button>
            </div>
            <TimetableDisplay timetableData={generatedTimetable} />
          </div>
        )}
    </div>
  );
}

export default TimetableGenerator;

