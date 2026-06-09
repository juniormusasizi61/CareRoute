import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, fetchClients } = useContext(AuthContext);
  const navigate = useNavigate();
  // Track the current client count for the navbar display.
  const [clientCount, setClientCount] = useState(0);
  // Track loading state while fetching the client list.
  const [loading, setLoading] = useState(false);

  // Load client count when user changes or component mounts.
  useEffect(() => {
    if (!user || !fetchClients) return;

    // Use a flag to prevent state updates after component unmount.
    let isMounted = true;

    const loadCount = async () => {
      try {
        setLoading(true);
        const clients = await fetchClients();
        if (isMounted) {
          setClientCount(clients.length);
        }
      } catch (err) {
        if (isMounted) {
          setClientCount(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCount();

    // Cleanup: mark component as unmounted to prevent stale state updates.
    return () => {
      isMounted = false;
    };
  }, [user, fetchClients]);

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
          {/* Show a quick client count in the navbar for authenticated users. */}
          <span style={{ marginLeft: 12, color: '#666', fontSize: '0.9rem' }}>
            {loading ? 'Loading...' : `Clients: ${clientCount}`}
          </span>
          <button onClick={handleLogout} style={{ marginLeft: 8 }}>Logout</button>
        </span>
      ) : (
        <Link to="/login" style={{ float: 'right' }}>Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
