import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';

import { db, auth } from '../../../firebase';

import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, writeBatch } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

const ADMIN_SUPPORT = { id: 'admin@educonnect.app', name: 'Complaint & Suggestion Box', role: 'Admin Support' };

// Canned responses for the admin
const cannedResponses = [
    "Thank you for your feedback. We are looking into it.",
    "This issue has been resolved. Please let us know if you face further problems.",
    "This has been forwarded to the concerned department.",
];

// A component to render the formatted complaint message
const FormattedComplaintMessage = ({ text }) => {
    const lines = text.split('\n');
    const data = {};
    lines.forEach(line => {
        if (line.startsWith('**')) {
            const parts = line.split(':**');
            if (parts.length > 1) {
                const key = parts[0].replace(/\*\*/g, '').trim();
                const value = parts[1].trim();
                data[key] = value;
            }
        }
    });
    if (!data.Category) return <p>{text}</p>;
    return (
        <div className="formatted-complaint">
            <div className={`complaint-tag ${data.Category.toLowerCase()}`}>{data.Category}</div>
            <p><strong>From:</strong> {data['Submitted by']}</p>
            <p className="complaint-details-text"><strong>Details:</strong> {data.Details}</p>
        </div>
    );
};

function MessagingPage() {
  const { user } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadChats, setUnreadChats] = useState({});
  const chatContainerRef = useRef(null);

  const [complaintStep, setComplaintStep] = useState('initial');
  const [complaintData, setComplaintData] = useState({ type: '' });
  
  useEffect(() => {
    onAuthStateChanged(auth, u => u ? setFirebaseUser(u) : signInAnonymously(auth));
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${process.env.REACT_APP_API_URL}/api/messaging/contacts/${user.role}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setContacts(data.filter(c => c.id !== user.email));
          }
        });
    }
  }, [user]);

  // Listener for unread messages
  useEffect(() => {
    if (!user) return;
    const allContactsToMonitor = (user.role !== 'school') ? [...contacts, ADMIN_SUPPORT] : contacts;
    if (allContactsToMonitor.length === 0) return;

    const unsubscribers = allContactsToMonitor.map(contact => {
      const roomId = [user.email, contact.id].sort().join('_');
      const q = query(collection(db, "chat_rooms", roomId, "messages"), where("isRead", "==", false), where("uid", "!=", user.email));
      return onSnapshot(q, (snapshot) => {
        setUnreadChats(prev => ({ ...prev, [contact.id]: !snapshot.empty }));
      });
    });
    return () => unsubscribers.forEach(unsub => unsub());
  }, [user, contacts]);

  // Listener for active chat messages
  useEffect(() => {
    if (!user || !activeChat) return;
    const roomId = [user.email, activeChat.id].sort().join('_');
    const q = query(collection(db, "chat_rooms", roomId, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user, activeChat]);
  
  // Auto-scrolling effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const markMessagesAsRead = async (contactId) => {
    if (!user) return;
    const roomId = [user.email, contactId].sort().join('_');
    const q = query(collection(db, "chat_rooms", roomId, "messages"), where("isRead", "==", false), where("uid", "!=", user.email));
    
    const unreadSnapshot = await getDocs(q);
    if (unreadSnapshot.empty) return;

    const batch = writeBatch(db);
    unreadSnapshot.docs.forEach(doc => batch.update(doc.ref, { isRead: true }));
    await batch.commit();
  };

  const selectChat = (contact) => {
    setActiveChat(contact);
    setMessages([]);
    markMessagesAsRead(contact.id);
    if (contact.id === ADMIN_SUPPORT.id) {
        setComplaintStep('initial');
    }
  };
  
  const handleSendMessage = async (e, textOverride = null) => {
    e?.preventDefault();
    const messageText = textOverride || newMessage;
    if (messageText.trim() === '' || !user || !activeChat) return;

    let finalMessage = messageText;

    if (activeChat.id === ADMIN_SUPPORT.id && user.role !== 'school') {
        if (complaintStep === 'details') {
            finalMessage = `**Category:** ${complaintData.type}\n**Submitted by:** ${user.name} (${user.email})\n**Details:** ${messageText}`;
            
            // Save to the central complaints log
            await addDoc(collection(db, "complaints"), {
                category: complaintData.type, fromName: user.name, fromEmail: user.email, details: messageText, createdAt: serverTimestamp(), status: 'New'
            });
            
            // Reset the form step
            setComplaintStep('initial'); 
        } else {
            // This should not happen, but as a fallback, send plain text
            finalMessage = messageText;
        }
    }

    const roomId = [user.email, activeChat.id].sort().join('_');
    await addDoc(collection(db, "chat_rooms", roomId, "messages"), { 
        text: finalMessage, 
        createdAt: serverTimestamp(), 
        uid: user.email, 
        displayName: user.name, 
        isRead: false 
    });
    
    setNewMessage('');
  };

  const handleComplaintTypeSelect = (type) => {
      setComplaintData({ type });
      setComplaintStep('details');
  };

  if (!user || !firebaseUser) return <div className="page-container"><p>Connecting...</p></div>;

  // --- Helper to determine which form to show ---
  const renderForm = () => {
    // 1. If the user is a student/teacher AND is in the complaint channel
    if (activeChat.id === ADMIN_SUPPORT.id && user.role !== 'school') {
      if (complaintStep === 'initial') {
        return (
          <div className="chat-options">
            <button className="chat-option-button" onClick={() => handleComplaintTypeSelect('Complaint')}>File a Complaint</button>
            <button className="chat-option-button" onClick={() => handleComplaintTypeSelect('Suggestion')}>Make a Suggestion</button>
          </div>
        );
      }
      if (complaintStep === 'details') {
        return (
          <form onSubmit={handleSendMessage} style={{width: '100%', display: 'flex'}}>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Please provide details..." />
            <button type="submit">Submit</button>
          </form>
        );
      }
    }

    // 2. If the user is an admin AND is in a direct message
    if (user.role === 'school' && activeChat.id !== ADMIN_SUPPORT.id) {
      return (
        <div className="canned-responses">
          <form onSubmit={handleSendMessage} style={{width: '100%', display: 'flex', marginBottom: '10px'}}>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a custom reply..." />
            <button type="submit">Send</button>
          </form>
          {cannedResponses.map((text, i) => (
            <button key={i} className="canned-response-button" onClick={(e) => handleSendMessage(e, text)}>
              {text}
            </button>
          ))}
        </div>
      );
    }
    
    // 3. Standard chat input for all other cases (e.g., student-teacher chat)
    return (
      <form onSubmit={handleSendMessage} className="chat-form">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." />
        <button type="submit">Send</button>
      </form>
    );
  };

  return (
    <div className="messaging-container">
      <div className="contacts-panel">
        {user.role !== 'school' && (
          <>
            <h3>Channels</h3>
            <ul>
              <li onClick={() => selectChat(ADMIN_SUPPORT)} className={activeChat?.id === ADMIN_SUPPORT.id ? 'active' : ''}>
                <div className="contact-info"><strong>🗳️ {ADMIN_SUPPORT.name}</strong><span>{ADMIN_SUPPORT.role}</span></div>
                {unreadChats[ADMIN_SUPPORT.id] && <div className="notification-dot"></div>}
              </li>
            </ul>
          </>
        )}
        <details className="contact-group">
            <summary>Teachers ({contacts.filter(c=>c.role.includes('Teacher')).length})</summary>
            <ul>
                {contacts.filter(c=>c.role.includes('Teacher')).map(contact => (
                    <li key={contact.id} onClick={() => selectChat(contact)} className={activeChat?.id === contact.id ? 'active' : ''}>
                        <div className="contact-info"><strong>{contact.name}</strong><span>{contact.role}</span></div>
                        {unreadChats[contact.id] && <div className="notification-dot"></div>}
                    </li>
                ))}
            </ul>
        </details>
        <details className="contact-group">
             <summary>Students ({contacts.filter(c=>c.role.includes('Student')).length})</summary>
            <ul>
                {contacts.filter(c=>c.role.includes('Student')).map(contact => (
                    <li key={contact.id} onClick={() => selectChat(contact)} className={activeChat?.id === contact.id ? 'active' : ''}>
                        <div className="contact-info"><strong>{contact.name}</strong><span>{contact.role}</span></div>
                        {unreadChats[contact.id] && <div className="notification-dot"></div>}
                    </li>
                ))}
            </ul>
        </details>
      </div>
      <div className="chat-panel" key={activeChat ? activeChat.id : 'no-chat'}>
        {activeChat ? (
          <>
            <div className="chat-header"><h3>{activeChat.name}</h3></div>
            <div className="chat-messages" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.uid === user.email ? 'sent' : 'received'}`}>
                       {/* **FIX:** This logic now formats the message for *everyone* */}
                       {(msg.text.includes('**Category:**')) ? (
                           <FormattedComplaintMessage text={msg.text} />
                       ) : (
                           <p>{msg.text}</p>
                       )}
                    </div>
                ))}
            </div>
            <div className="chat-form">
              {renderForm()}
            </div>
          </>
        ) : (
          <div className="no-chat-selected"><p>Select a conversation.</p></div>
        )}
      </div>
    </div>
  );
}

export default MessagingPage;

