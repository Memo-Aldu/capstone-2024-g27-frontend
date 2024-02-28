import './App.css';
import Home from './pages/Home';
import ContactManagement from './pages/ContactManagement';
import Messaging from './pages/Messaging';
import Navbar from './component/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {

  return (

    <Router>

      <Navbar>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/ContactManagement" element={<ContactManagement/>} />
          <Route path="/Messaging" element={<Messaging/>} />
        </Routes>
      </Navbar>

    </Router>
      
  );
}

export default App;
