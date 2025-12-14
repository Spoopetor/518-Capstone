import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useUser} from '@clerk/clerk-react'
import AppNavbar from './AppNavbar.jsx'
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Login from './pages/Login.jsx';


const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  // Wait for Clerk to load the user status
  if (!isLoaded) {
    // You might show a loading spinner here while authentication status is determined
    return <div>Loading authentication...</div>; 
  }

  // If not signed in, navigate to the home page ("/")
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // If signed in, render the protected content
  return children ? children : <Outlet />;
};

export default function App() {
  return (
    <Router>
      <AppNavbar id="app-navbar"/>
        <div id="app-container" className="mt-4">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/518-Capstone" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile /> 
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
    </Router>
  );
}