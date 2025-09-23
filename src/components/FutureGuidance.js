import React, { useState } from 'react';

function FutureGuidance() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  // Sample student data. In a real app, this would be fetched.
  const studentData = {
    grades: { 'Physics': 'A+', 'Chemistry': 'A', 'Mathematics': 'A+', 'English': 'B' },
    extracurriculars: ['President, Robotics Club', 'Winner, Inter-School Hackathon'],
    interests: ['Artificial Intelligence', 'Problem Solving', 'Coding']
  };

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const systemPrompt = `You are an expert career counselor for high school students in India. Based on the provided JSON data of a student's performance and interests, generate a detailed career analysis. Your response must be in Markdown format and strictly follow this structure:
    ### Top 3 Career Suggestions
    - **Career 1:** [Name of career]. [1-2 sentence explanation why it's a good fit].
    - **Career 2:** [Name of career]. [1-2 sentence explanation why it's a good fit].
    - **Career 3:** [Name of career]. [1-2 sentence explanation why it's a good fit].
    ### Roadmap for Top Choice
    - **Recommended Subjects:** [List of subjects].
    - **Key Entrance Exams:** [List of exams like JEE, BITSAT, etc.].
    - **Potential Colleges:** [List of 2-3 aspirational colleges].
    - **Skills to Develop:** [List of skills like programming languages, soft skills, etc.].`;

    const userPrompt = JSON.stringify(studentData);

    try {
        const apiKey = ""; // Leave as-is
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        const payload = {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }],
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const text = result.candidates[0].content.parts[0].text;
        setAnalysisResult(text);

    } catch (err) {
        console.error("Error fetching analysis:", err);
        setError("Sorry, we couldn't generate the analysis at this time. Please try again later.");
    } finally {
        setIsLoading(false);
    }
  };

  // A simple function to render the Markdown-like response into HTML
  const renderAnalysis = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    lines.forEach((line, index) => {
      if (line.startsWith('### ')) {
        elements.push(<h3 key={index}>{line.substring(4)}</h3>);
      } else if (line.startsWith('- **')) {
        const boldText = line.match(/\*\*(.*?)\*\*/)[1];
        const restOfText = line.substring(line.indexOf(':**') + 4);
        elements.push(<li key={index}><strong>{boldText}:</strong>{restOfText}</li>);
      } else if (line.startsWith('- ')) {
        elements.push(<li key={index}>{line.substring(2)}</li>);
      } else if(line.length > 0) {
        elements.push(<p key={index}>{line}</p>);
      }
    });
    return elements;
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
            <pre className="data-preview">
                {JSON.stringify(studentData, null, 2)}
            </pre>
            <button className="form-button" onClick={handleAnalysis} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Generate Career Roadmap'}
            </button>
        </div>
        
        <div className="guidance-output-section">
            <h3>AI-Powered Analysis</h3>
            {isLoading && <div className="loading-spinner"></div>}
            {error && <div className="error-message">{error}</div>}
            {analysisResult && (
                <div className="analysis-result">
                    {renderAnalysis(analysisResult)}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default FutureGuidance;
