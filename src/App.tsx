import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Layout from 'src/components/Layout'
import Home from 'src/pages/Home'
import MessagingLayout from 'src/components/MessagingLayout'
import QuickMessage from 'src/pages/Messaging/QuickMessage'
import ContactManagementLayout from 'src/components/ContactManagementLayout'
import Contacts from 'src/pages/contact/Contacts'
import ContactsGroupes from 'src/pages/contact/ContactGroupe'
import Conversation from 'src/pages/Messaging/Conversation'
import Placeholder from 'src/pages/Placeholer'

function App (): JSX.Element {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/messaging" element={<MessagingLayout/>} />
          <Route path="/messaging/quickmessage" element={<QuickMessage/>} />
          <Route path="/messaging/campaign" element={<Placeholder title="Campaign" />} />
          <Route path="/messaging/templates" element={<Placeholder title="Templates" />} />
          <Route path="/messaging/emailToSMS" element={<Placeholder title="Email to SMS" />} />
          <Route path="/messaging/history" element={<Placeholder title="History" />} />
          <Route path="/contact-management" element={<ContactManagementLayout />} />
          <Route path="/ContactManagement/contacts" element={<Contacts />} />
          <Route path="/ContactManagement/groupes" element={<ContactsGroupes/>} />
          <Route path="/messaging/conversation" element={<Conversation />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
