import React, { useState, useEffect, useRef } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Load initial messages from localStorage or set a default welcome message
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ai-chat-history');
      return saved ? JSON.parse(saved) : [{ role: 'assistant', content: 'Hello! I am Eddy, your AI Assistant. How can I help you today?' }];
    } catch (e) {
      return [{ role: 'assistant', content: 'Hello! I am Eddy, your AI Assistant. How can I help you today?' }];
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ai-chat-history', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(1) }) // Exclude initial prompt
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* The floating action button */}
      <button onClick={() => setIsOpen(true)} className="chatbot-fab">
        🤖
      </button>

      {/* The Modal */}
      {isOpen && (
        <div className="chatbot-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="chatbot-modal-content" onClick={e => e.stopPropagation()}>
            <header className="chatbot-header">
              <h3>AI Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="chatbot-close-button">×</button>
            </header>
            
            <main className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role === 'user' ? 'sent' : 'received'}`}>
                  <p>{msg.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="message received">
                  <div className="typing-indicator"><span></span><span></span><span></span></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </main>

            <footer className="chatbot-footer">
              <form onSubmit={handleSendMessage} className="chat-form">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>Send</button>
              </form>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
