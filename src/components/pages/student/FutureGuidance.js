import React, { useState, useEffect, useRef } from 'react';

function FutureGuidance() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const analysisSectionRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/student-interests`);
        if (!response.ok) {
          throw new Error('Could not fetch student profile.');
        }
        const data = await response.json();
        setStudentData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, []); 

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    setTimeout(() => {
        analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/guidance`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setAnalysisResult(result.analysis);
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setError(`Sorry, we couldn't generate the analysis. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnalysis = (text) => {
    if (!text) return null;
    const items = text.split('\n').map((line, index) => {
      if (line.startsWith('### ')) return <h3 key={index}>{line.substring(4)}</h3>;
      if (line.startsWith('- **')) {
        const boldTextMatch = line.match(/\*\*(.*?)\*\*/);
        if(boldTextMatch) {
            const boldText = boldTextMatch[1];
            const restOfText = line.substring(line.indexOf(':**') + 4);
            return <li key={index}><strong>{boldText}:</strong>{restOfText}</li>;
        }
      }
      if (line.startsWith('- ')) return <li key={index}>{line.substring(2)}</li>;
      if (line.trim()) return <p key={index}>{line}</p>;
      return null;
    });
    return items;
  };

  return (
    <div className="page-container">
      <h1>✨ Future Guidance</h1>
      <p className="page-intro">
        Leverage the power of AI to analyze your academic and extracurricular profile. Get personalized career suggestions and a roadmap to achieve your goals.
      </p>

      <div className="guidance-card">
        <div className="guidance-input-section">
            <h3>Your Profile Snapshot</h3>
            <p>This data will be sent for analysis:</p>
            
            {studentData ? (
              <div className="data-preview-structured">
                
                <div className="data-section">
                  <strong>Extracurriculars:</strong>
                  <p>{studentData.extracurriculars.join(', ')}</p>
                </div>
                <div className="data-section">
                  <strong>Interests:</strong>
                  <div className="interest-tags">
                    {studentData.interests.map((interest, i) => (
                      <span key={i} className="interest-tag">{interest}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <pre className="data-preview">Loading profile...</pre>
            )}

            <button className="form-button" onClick={handleAnalysis} disabled={isLoading || !studentData}>
                {isLoading ? 'Analyzing...' : 'Generate Career Roadmap'}
            </button>
        </div>
        
        <div className="guidance-output-section" ref={analysisSectionRef}>
            <h3>AI-Powered Analysis</h3>
            {isLoading && <div className="loading-spinner"></div>}
            {error && <div className="error-message">{error}</div>}
            {analysisResult && (
                <ul className="analysis-result">
                    {renderAnalysis(analysisResult)}
                </ul>
            )}
        </div>
      </div>
    </div>
  );
}

export default FutureGuidance;

