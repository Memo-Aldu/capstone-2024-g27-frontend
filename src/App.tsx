import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Messaging from './pages/Messaging'
import ContactManagement from './pages/ContactManagement'

function App () {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/contact-management" element={<ContactManagement />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
