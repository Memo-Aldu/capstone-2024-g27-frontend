import React, { useState } from 'react';

const QuickSMS = ({ onSendSMS }) => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSendClick = () => {
    if (onSendSMS && recipient && message) {
      onSendSMS(recipient, message);
      setRecipient('');
      setMessage('');
    }
  };

  return (
    <div className="quick-sms">
      <h3>Quick SMS</h3>
      <input
        type="text"
        placeholder="Recipient's phone number"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <textarea
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendClick}>Send SMS</button>
    </div>
  );
};

export default QuickSMS;