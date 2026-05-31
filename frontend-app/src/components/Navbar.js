import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: 16 }}>Dashboard</Link>
      <Link to="/input" style={{ marginRight: 16 }}>Input</Link>
      <Link to="/map" style={{ marginRight: 16 }}>Map</Link>
      {user ? (
        <span style={{ float: 'right' }}>
          {user.name || user.email}
          <button onClick={handleLogout} style={{ marginLeft: 8 }}>Logout</button>
        </span>
      ) : (
        <Link to="/login" style={{ float: 'right' }}>Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
