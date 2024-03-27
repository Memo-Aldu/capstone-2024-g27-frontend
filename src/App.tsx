import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import MessagingLayout from './components/MessagingLayout'
import QuickSMS from './pages/Messaging/QuickSMS'
import Campaign from './pages/Messaging/Campaign'
import Templates from './pages/Messaging/Templates'
import EmailToSMS from './pages/Messaging/EmailToSMS'
import History from './pages/Messaging/History'

function App (): JSX.Element {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/messaging" element={<MessagingLayout/>} />
          <Route path="/messaging/quicksms" element={<QuickSMS/>} />
          <Route path="/messaging/campaign" element={<Campaign/>} />
          <Route path="/messaging/templates" element={<Templates/>} />
          <Route path="/messaging/emailToSMS" element={<EmailToSMS/>} />
          <Route path="/messaging/history" element={<History/>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
