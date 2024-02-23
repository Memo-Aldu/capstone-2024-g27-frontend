import './App.css';
import QuickSMS from './QuickSMS'
function App() {

  const sendSMS = (recipient, message) => {
    // Your SMS sending logic here, using an API or a library
    console.log(`Sending SMS to ${recipient}: ${message}`);
  };

  return (
    <div className="App">
      <div className="App">
      <QuickSMS onSendSMS={sendSMS} />
      {/* Add other features like SMS Campaign, Templates, Email to SMS, and History */}
      </div>
    </div>
  );
}

export default App;
