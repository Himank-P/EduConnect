import React, { useState } from 'react';

function UploadMarks() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload/sheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl, uploadType: 'Marks' }),
      });
      if (!response.ok) throw new Error('Submission failed.');
      alert('Marks sheet link submitted successfully for processing!');
      setSheetUrl('');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>📤 Upload Student Marks</h2>
          <p>Paste the shareable link to your Google Sheet containing student marks. Ensure the sheet is publicly viewable.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="sheetUrl">Google Sheet URL</label>
            <input
              type="url"
              id="sheetUrl"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/..."
              required
            />
          </div>
          <button type="submit" className="form-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Upload for Processing'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadMarks;
