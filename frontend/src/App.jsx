import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppNavbar from './AppNavbar.jsx'
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  return (
    <Router>
      <AppNavbar id="app-navbar"/>
        <div id="app-container" className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
    </Router>
  );
}