import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase'; 
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from '../../../context/AuthContext';

function ComplaintsLog() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); 

  useEffect(() => {
    const complaintsRef = collection(db, "complaints");
    const q = query(complaintsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const complaintsData = [];
      querySnapshot.forEach((doc) => {
        complaintsData.push({ id: doc.id, ...doc.data() });
      });
      setComplaints(complaintsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching complaints:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkAsCompleted = async (complaint) => {
    if (!user) return;
    
    const complaintRef = doc(db, "complaints", complaint.id);
    await updateDoc(complaintRef, {
      status: "Resolved"
    });

    const replyMessage = `Your ${complaint.category.toLowerCase()} regarding "${complaint.details.substring(0, 20)}..." has been marked as resolved by the admin.`;
    const roomId = [user.email, complaint.fromEmail].sort().join('_');
    const messagesRef = collection(db, "chat_rooms", roomId, "messages");
    
    await addDoc(messagesRef, {
      text: replyMessage,
      createdAt: serverTimestamp(),
      uid: user.email, 
      displayName: user.name,
      isRead: false
    });

  };

  if (isLoading) {
    return <div className="page-container">Loading Complaints Log...</div>;
  }

  const newComplaints = complaints.filter(c => c.status === 'New');
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved');

  return (
    <div className="page-container">
      <h1>🗳️ Complaints & Suggestions Log</h1>
      <p className="page-intro">A central log of all feedback submitted by students and teachers.</p>
      
      <div className="admin-section">
        <h2>New Complaints</h2>
        <div className="complaints-list">
          {newComplaints.length > 0 ? (
            newComplaints.map(item => (
              <div className="complaint-card" key={item.id}>
                <div className="complaint-header">
                  <span className={`complaint-tag ${item.category?.toLowerCase()}`}>{item.category}</span>
                  <span className="complaint-date">
                    {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleString() : 'No date'}
                  </span>
                </div>
                <div className="complaint-body">
                  <p>{item.details}</p>
                </div>
                <div className="complaint-footer">
                  <strong>From:</strong> {item.fromName} ({item.fromEmail})
                  <button className="canned-response-button" onClick={() => handleMarkAsCompleted(item)}>
                    Mark as Completed
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No new complaints or suggestions.</p>
          )}
        </div>
      </div>

      <div className="admin-section">
        <h2>Resolved Complaints</h2>
        <div className="complaints-list">
          {resolvedComplaints.map(item => (
            <div className="complaint-card resolved" key={item.id}>
              <div className="complaint-header">
                <span className={`complaint-tag ${item.category?.toLowerCase()}`}>{item.category}</span>
                <span className="complaint-date">
                  {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleString() : 'No date'}
                </span>
              </div>
              <div className="complaint-body">
                <p>{item.details}</p>
              </div>
              <div className="complaint-footer">
                <strong>From:</strong> {item.fromName} ({item.fromEmail})
                <span className="status-resolved">Resolved</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ComplaintsLog;

