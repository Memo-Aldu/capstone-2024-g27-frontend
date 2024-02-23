import React, { useState } from 'react';

const SMSCampaign = ({ onSendCampaign }) => {
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [entries, setEntries] = useState(20);

  const handleAddRecipient = () => {
    if (recipients.length < 20) {
      setRecipients([...recipients, '']);
    }
  };

  const handleRemoveRecipient = (index) => {
    const newRecipients = [...recipients];
    newRecipients.splice(index, 1);
    setRecipients(newRecipients);
  };

  const handleSendCampaign = () => {
    if (onSendCampaign && campaignName && message && recipients.every(Boolean)) {
      onSendCampaign(campaignName, message, recipients);
      setCampaignName('');
      setMessage('');
      setRecipients(recipients.map(() => ''));
    }
  };

  return (
    <div className="sms-campaign">
      <h3>SMS Campaign</h3>
      <input
        type="text"
        placeholder="Campaign name"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
      />
      <textarea
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="recipients">
        {recipients.map((recipient, index) => (
          <div key={index} className="recipient">
            <input
              type="text"
              placeholder={`Recipient ${index + 1}`}
              value={recipient}
              onChange={(e) => {
                const newRecipients = [...recipients];
                newRecipients[index] = e.target.value;
                setRecipients(newRecipients);
              }}
            />
            <button onClick={() => handleRemoveRecipient(index)}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddRecipient}>Add Recipient</button>
      </div>
      <button onClick={handleSendCampaign}>Send Campaign</button>
    </div>
  );
};

export default SMSCampaign;