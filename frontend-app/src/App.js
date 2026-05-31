import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import InputPage from './pages/InputPage';
import MapPage from './pages/MapPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ padding: 16 }}>
          {/* Public routes for MVP; protected routes can wrap these next. */}
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/input" element={<InputPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
