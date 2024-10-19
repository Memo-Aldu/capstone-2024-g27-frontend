import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Layout from 'src/components/Layout'
import Home from 'src/pages/Home'
import MessagingLayout from 'src/components/MessagingLayout'
import QuickMessage from 'src/pages/Messaging/QuickMessage'
import Campaign from 'src/pages/Messaging/Campaign'
import Templates from 'src/pages/Messaging/Templates'
import EmailToSMS from 'src/pages/Messaging/EmailToSMS'
import History from 'src/pages/Messaging/History'
import ContactManagementLayout from 'src/components/contact/ContactManagementLayout'
import Contacts from 'src/pages/contact/Contacts'
import Groupes from 'src/pages/contact/Groupes'
import Conversation from 'src/pages/Messaging/Conversation'

function App (): JSX.Element {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/messaging" element={<MessagingLayout/>} />
          <Route path="/messaging/quickmessage" element={<QuickMessage/>} />
          <Route path="/messaging/campaign" element={<Campaign/>} />
          <Route path="/messaging/templates" element={<Templates/>} />
          <Route path="/messaging/emailToSMS" element={<EmailToSMS/>} />
          <Route path="/messaging/history" element={<History/>} />
          <Route path="/contact-management" element={<ContactManagementLayout />} />
          <Route path="/ContactManagement/contacts" element={<Contacts />} />
          <Route path="/ContactManagement/groupes" element={<Groupes />} />
          <Route path="/messaging/conversation" element={<Conversation />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
