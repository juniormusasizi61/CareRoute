import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import InputPage from './pages/InputPage';
import MapPage from './pages/MapPage';
import AuthPage from './pages/AuthPage';
import AuthContext from './contexts/AuthContext';

// Protect routes and redirect unauthenticated users to the login page.
const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ padding: 16 }}>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/input" element={<PrivateRoute element={<InputPage />} />} />
            <Route path="/map" element={<PrivateRoute element={<MapPage />} />} />
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
