import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Layout from 'src/components/Layout'
import Home from 'src/pages/Home'
import MessagingLayout from 'src/components/sms/MessagingLayout'
import QuickSMS from 'src/pages/sms/QuickSMS'
import Campaign from 'src/pages/sms/Campaign'
import Templates from 'src/pages/sms/Templates'
import EmailToSMS from 'src/pages/sms/EmailToSMS'
import History from 'src/pages/sms/History'
import ContactManagementLayout from 'src/components/contact/ContactManagementLayout'
import Contacts from 'src/pages/contact/Contacts'
import Groupes from 'src/pages/contact/Groupes'

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
          <Route path="/contact-management" element={<ContactManagementLayout />} />
          <Route path="/ContactManagement/contacts" element={<Contacts />} />
          <Route path="/ContactManagement/groupes" element={<Groupes />} />

        </Routes>
      </Layout>
    </Router>
  )
}

export default App
