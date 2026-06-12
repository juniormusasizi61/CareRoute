import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, fetchClients } = useContext(AuthContext);
  const [clientCount, setClientCount] = useState(0);
  // Track whether the dashboard summary is waiting for the client API response.
  const [loading, setLoading] = useState(false);
  // Store any API error so the dashboard can show a friendly failure message.
  const [error, setError] = useState(null);

  // Load the saved client count for authenticated dispatchers.
  useEffect(() => {
    if (!user || !fetchClients) return;

    // Prevent state updates if the dashboard unmounts before the API call finishes.
    let isMounted = true;
    const loadClientCount = async () => {
      setLoading(true);
      try {
        const clients = await fetchClients();
        if (isMounted) {
          setClientCount(clients.length);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load client count');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadClientCount();

    return () => {
      isMounted = false;
    };
  }, [user, fetchClients]);

  // Show a personalized greeting for authenticated users; default greeting for guests.
  const greeting = user
    ? `Welcome back, ${user.name || user.email}!`
    : 'Welcome to CareRoute — choose an action below to get started.';


  return (
    <div>
      <h2>Dashboard</h2>
      <p>{greeting}</p>
      <ul>
        <li><Link to="/input">Add clients & schedules</Link></li>
        <li><Link to="/map">View routes on map</Link></li>
      </ul>
      {user ? (
        // Dashboard summary card for authenticated dispatchers.
        <section style={{ marginTop: 16, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3>Saved clients</h3>
          {loading ? (
            <p>Loading client count...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <p>{clientCount} saved client{clientCount === 1 ? '' : 's'}.</p>
          )}
        </section>
      ) : (
        <p style={{ marginTop: 16 }}>Saved client data will appear here after login.</p>
      )}
    </div>
  );
};

export default DashboardPage;
