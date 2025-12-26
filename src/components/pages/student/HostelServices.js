import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function HostelServices() {
    const { user } = useAuth();

    const [issueDescription, setIssueDescription] = useState('');
    const [changeReason, setChangeReason] = useState('');
    const [preferredRoommate, setPreferredRoommate] = useState('');

    const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
    const [isSubmittingChange, setIsSubmittingChange] = useState(false);

    const [submissionStatus, setSubmissionStatus] = useState('');

    const [myRequests, setMyRequests] = useState([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(true);

    const fetchMyRequests = async () => {
        if (!user || !user.email) {
            setMyRequests([]);
            setIsLoadingRequests(false);
            return;
        }
        setIsLoadingRequests(true);
        try {
            // Use query parameter for email - NOTE: insecure for production, use proper auth
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/student/hostel/my-requests?email=${encodeURIComponent(user.email)}`);
            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch requests.');
            }
            const data = await response.json();
            setMyRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
            setSubmissionStatus(`Error fetching requests: ${error.message}`);
        } finally {
            setIsLoadingRequests(false);
        }
    };

    useEffect(() => {
        fetchMyRequests();
        // Disabling dependency array linting as we want manual refetch via fetchMyRequests()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleReportIssue = async (e) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmittingIssue(true);
        setSubmissionStatus('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/student/hostel/report-issue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: issueDescription,
                    studentName: user.name,
                    studentEmail: user.email
                })
            });
            const result = await response.json();
             if (!response.ok) {
                throw new Error(result.error || 'Failed to report issue.');
            }
            setSubmissionStatus('Issue reported successfully!');
            setIssueDescription('');
            fetchMyRequests(); // Refetch requests after submission
        } catch (error) {
            console.error("Issue submission error:", error);
            setSubmissionStatus(`Error reporting issue: ${error.message}`);
        } finally {
            setIsSubmittingIssue(false);
        }
    };

    const handleRequestChange = async (e) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmittingChange(true);
        setSubmissionStatus('');

        try {
             const response = await fetch(`${process.env.REACT_APP_API_URL}/api/student/hostel/request-change`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reason: changeReason,
                    preferredRoommate: preferredRoommate || 'None',
                    studentName: user.name,
                    studentEmail: user.email
                })
            });
            const result = await response.json();
             if (!response.ok) {
                throw new Error(result.error || 'Failed to request change.');
            }
            setSubmissionStatus('Room change requested successfully!');
            setChangeReason('');
            setPreferredRoommate('');
            fetchMyRequests(); // Refetch requests after submission
        } catch (error) {
            console.error("Change request submission error:", error);
            setSubmissionStatus(`Error requesting change: ${error.message}`);
        } finally {
            setIsSubmittingChange(false);
        }
    };

    return (
        <div className="page-container">
            <Link to="/dashboard" className="back-link-button">← Back to Dashboard</Link>
            <h1>Hostel Services</h1>
            <p className="page-intro">
                Report issues with your room or request a room change.
            </p>

            {submissionStatus && <p className={submissionStatus.startsWith('Error') ? 'error-message' : 'success-message'} style={{marginTop:'15px'}}>{submissionStatus}</p>}

            <div className="admin-section">
                <h2>Report an Issue</h2>
                <div className='dashboard-card'>
                    <form onSubmit={handleReportIssue} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="issueDescription">Describe the Issue</label>
                            <textarea
                                id="issueDescription"
                                value={issueDescription}
                                onChange={(e) => setIssueDescription(e.target.value)}
                                rows="4"
                                placeholder="e.g., Leaky faucet in the bathroom, Lightbulb not working..."
                                required
                            />
                        </div>
                        <button type="submit" className="form-button" disabled={isSubmittingIssue}>
                            {isSubmittingIssue ? 'Submitting...' : 'Report Issue'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="admin-section">
                <h2>Request Room Change</h2>
                 <div className='dashboard-card'>
                    <form onSubmit={handleRequestChange} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="changeReason">Reason for Change</label>
                            <textarea
                                id="changeReason"
                                value={changeReason}
                                onChange={(e) => setChangeReason(e.target.value)}
                                rows="3"
                                placeholder="Please explain why you need a room change..."
                                required
                            />
                        </div>
                         <div className="form-group">
                            <label htmlFor="preferredRoommate">Preferred Roommate ID (Optional)</label>
                            <input
                                type="text"
                                id="preferredRoommate"
                                value={preferredRoommate}
                                onChange={(e) => setPreferredRoommate(e.target.value)}
                                placeholder="Enter Student ID if applicable"
                            />
                        </div>
                        <button type="submit" className="form-button" disabled={isSubmittingChange}>
                            {isSubmittingChange ? 'Submitting...' : 'Request Change'}
                        </button>
                    </form>
                </div>
            </div>

             <div className="admin-section">
                <h2>My Requests & Reports Status</h2>
                 <div className='dashboard-card'>
                    {isLoadingRequests ? (
                        <p>Loading your requests...</p>
                    ) : myRequests.length === 0 ? (
                        <p>You haven't submitted any requests or reports yet.</p>
                    ) : (
                        <div className="table-container">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Details</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myRequests.map(req => (
                                         <tr key={req.id}>
                                            <td data-label="Date">{req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'Pending...'}</td>
                                            <td data-label="Type">{req.type}</td>
                                            <td data-label="Details">{req.description || req.reason}</td>
                                            <td data-label="Status">
                                                <span className={`status ${
                                                    req.status === 'Resolved' || req.status === 'Approved' ? 'status-paid'
                                                    : req.status === 'Rejected' ? 'status-pending'
                                                    : 'status-pending'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HostelServices;

