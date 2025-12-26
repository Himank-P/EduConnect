import React, { useState, useEffect } from 'react';
import HostelRoomModal from '../../ui/modals/HostelRoomModal'; // Adjusted path
import { db } from '../../../firebase'; // Adjusted path
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext'; // Adjusted path

function HostelAdmin() {
    // Get user AND loading state from context
    const { user, loading: authLoading } = useAuth();
    const [hostelData, setHostelData] = useState(null);
    const [isLoadingApi, setIsLoadingApi] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isAllocating, setIsAllocating] = useState(false);
    const [apiStatus, setApiStatus] = useState('');

    const [issues, setIssues] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isLoadingFirestore, setIsLoadingFirestore] = useState(true);
    const [firestoreStatus, setFirestoreStatus] = useState('');

    const fetchData = async () => {
        setIsLoadingApi(true);
        setApiStatus('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/hostel`);
            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
                 throw new Error(errorData.error || `HTTP error ${response.status}`);
            }
            const data = await response.json();
            console.log("Data received by fetchData in HostelAdmin:", data);
            setHostelData(data);
        } catch (error) {
            console.error("Error fetching API data:", error);
            setApiStatus(`Error fetching hostel data: ${error.message}`);
        } finally {
            setIsLoadingApi(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Wait for auth context to finish loading AND user object to be available
        if (authLoading) {
            setFirestoreStatus("Waiting for authentication...");
            setIsLoadingFirestore(false); // Not actively loading Firestore yet
            return;
        }
        if (!user) {
            setFirestoreStatus("User not authenticated.");
            setIsLoadingFirestore(false);
            setIssues([]);
            setRequests([]);
            return;
        }

        console.log("Auth ready, attaching Firestore listeners for user:", user.email);
        setIsLoadingFirestore(true);
        setFirestoreStatus('Attaching listeners...');
        const issuesRef = collection(db, "hostel_issues");
        const requestsRef = collection(db, "hostel_requests");

        const qIssues = query(issuesRef, orderBy("createdAt", "desc"));
        const qRequests = query(requestsRef, orderBy("createdAt", "desc"));

        let combinedLoading = { issues: true, requests: true };
        const checkLoadingDone = () => {
            if (!combinedLoading.issues && !combinedLoading.requests) {
                setIsLoadingFirestore(false);
                setFirestoreStatus('Listeners active.');
            }
        };

        const unsubscribeIssues = onSnapshot(qIssues, (snapshot) => {
            const fetchedIssues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Firestore: Fetched Issues", fetchedIssues);
            setIssues(fetchedIssues);
            combinedLoading.issues = false;
            checkLoadingDone();
        }, (error) => {
            console.error("Error fetching issues:", error);
            setFirestoreStatus(`Error fetching issues: ${error.message}`);
            combinedLoading.issues = false;
            checkLoadingDone();
        });

         const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
            const fetchedRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Firestore: Fetched Requests", fetchedRequests);
            setRequests(fetchedRequests);
            combinedLoading.requests = false;
            checkLoadingDone();
         }, (error) => {
             console.error("Error fetching requests:", error);
             setFirestoreStatus(`Error fetching requests: ${error.message}`);
             combinedLoading.requests = false;
             checkLoadingDone();
         });

        return () => {
            console.log("Cleaning up Firestore listeners.");
            unsubscribeIssues();
            unsubscribeRequests();
        };
    // Ensure this runs when auth is ready OR when the user changes
    }, [user, authLoading]);

    const handleAllocate = async () => {
        setIsAllocating(true);
        setApiStatus('Allocating rooms...');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/hostel/allocate`, {
                method: 'POST',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Allocation failed.');
            }
            setApiStatus(result.message || 'Allocation successful!');
            fetchData();
        } catch (error) {
            console.error('Allocation Error:', error);
            setApiStatus(`Allocation failed: ${error.message}`);
        } finally {
            setIsAllocating(false);
        }
    };

    const updateRequestStatus = async (id, newStatus, collectionName) => {
        const docRef = doc(db, collectionName, id);
        setFirestoreStatus(`Updating ${id} to ${newStatus}...`);
        try {
            await updateDoc(docRef, { status: newStatus });
            setFirestoreStatus(`Request ${id} status updated successfully.`);
        } catch (error) {
            console.error(`Error updating status for ${id}:`, error);
             setFirestoreStatus(`Error updating status: ${error.message}`);
        }
    };

    // Ensure roomsArray calculation uses hostelData directly
    const roomsArray = hostelData?.rooms || [];
    const pendingIssues = issues.filter(i => i.status === 'Pending');
    const pendingRequests = requests.filter(r => r.status === 'Pending');

    return (
        <>
            <div className="page-container">
                <h1>🛏️ Hostel Management</h1>
                <p className="page-intro">Track room occupancy, manage staff, and handle student requests/issues.</p>

                 <div style={{ marginBottom: '20px' }}>
                    <button
                        type="button"
                        className="admin-action-button"
                        onClick={handleAllocate}
                        disabled={isAllocating || isLoadingApi}
                    >
                        {isAllocating ? 'Allocating...' : 'Allocate Rooms Automatically'}
                    </button>
                    {apiStatus && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>API Status: {apiStatus}</p>}
                 </div>


                {isLoadingApi ? (
                    <p>Loading hostel details...</p>
                ) : hostelData?.staff ? (
                    <div className="summary-grid admin-kpi-grid">
                        <div className="summary-card">
                            <div className="summary-value">{hostelData.staff.warden}</div>
                            <div className="summary-label">Warden</div>
                        </div>
                        {hostelData.consumption && (
                         <>
                            <div className="summary-card">
                                <div className="summary-value">{hostelData.consumption.water}</div>
                                <div className="summary-label">Water Usage</div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-value">{hostelData.consumption.electricity}</div>
                                <div className="summary-label">Power Usage</div>
                            </div>
                         </>
                        )}
                    </div>
                ): null }

                <div className="admin-section">
                    <h2>Room Occupancy</h2>
                    {isLoadingApi ? (
                        <p>Loading occupancy...</p>
                    ) : (
                        <div className="table-container">
                            <table className="history-table student-list-table">
                                <thead>
                                    <tr>
                                        <th>Room No.</th>
                                        <th>Building</th>
                                        <th>Occupants</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {roomsArray.length > 0 ? (
                                        roomsArray.map((roomData) => (
                                            <tr key={roomData.roomId} onClick={() => setSelectedRoom(roomData.roomId)}>
                                                <td data-label="Room No."><strong>{roomData.roomId}</strong></td>
                                                <td data-label="Building">{roomData.buildingId}</td>
                                                <td data-label="Occupants">
                                                    {Array.isArray(roomData.occupants) ? roomData.occupants.join(', ') : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{textAlign: 'center'}}>No rooms allocated yet or data unavailable. Run the allocation process.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="admin-section">
                    <h2>Pending Issues & Requests</h2>
                    {firestoreStatus && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Firestore Status: {firestoreStatus}</p>}
                     {/* Show loading state based on authLoading OR isLoadingFirestore */}
                     {authLoading || (isLoadingFirestore && user) ? (
                         <p>Loading requests from Firestore...</p>
                     ) : !user ? (
                         <p>Please log in to view requests.</p>
                     ) : (
                        <>
                             <h3>Issue Reports ({pendingIssues.length} Pending)</h3>
                            <div className="table-container">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Student</th>
                                            <th>Description</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingIssues.length > 0 ? pendingIssues.map(issue => (
                                            <tr key={issue.id}>
                                                <td data-label="Date">{issue.createdAt?.seconds ? new Date(issue.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                                                <td data-label="Student">{issue.studentName} ({issue.studentEmail})</td>
                                                <td data-label="Description">{issue.description}</td>
                                                <td data-label="Actions">
                                                    <button className="form-button" style={{width:'auto', padding:'5px 10px', fontSize:'0.9em', marginRight:'5px'}} onClick={() => updateRequestStatus(issue.id, 'Resolved', 'hostel_issues')}>Mark Resolved</button>
                                                </td>
                                            </tr>
                                        )) : (
                                             <tr><td colSpan="4" style={{textAlign:'center'}}>No pending issues.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                             <h3 style={{marginTop: '30px'}}>Room Change Requests ({pendingRequests.length} Pending)</h3>
                            <div className="table-container">
                                <table className="history-table">
                                     <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Student</th>
                                            <th>Reason</th>
                                            <th>Preferred Roommate</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                      <tbody>
                                        {pendingRequests.length > 0 ? pendingRequests.map(req => (
                                            <tr key={req.id}>
                                                <td data-label="Date">{req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                                                <td data-label="Student">{req.studentName} ({req.studentEmail})</td>
                                                <td data-label="Reason">{req.reason}</td>
                                                <td data-label="Preferred Roommate">{req.preferredRoommate}</td>
                                                <td data-label="Actions">
                                                    <button className="form-button" style={{width:'auto', padding:'5px 10px', fontSize:'0.9em', marginRight:'5px', backgroundColor:'#2ecc71'}} onClick={() => updateRequestStatus(req.id, 'Approved', 'hostel_requests')}>Approve</button>
                                                    <button className="form-button" style={{width:'auto', padding:'5px 10px', fontSize:'0.9em', backgroundColor:'#e74c3c'}} onClick={() => updateRequestStatus(req.id, 'Rejected', 'hostel_requests')}>Reject</button>
                                                </td>
                                            </tr>
                                        )) : (
                                             <tr><td colSpan="5" style={{textAlign:'center'}}>No pending room change requests.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>


            </div>
            {selectedRoom && <HostelRoomModal roomId={selectedRoom} closeModal={() => setSelectedRoom(null)} />}
        </>
    );
}

export default HostelAdmin;

