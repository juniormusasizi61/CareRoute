import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

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
    </div>
  );
};

export default DashboardPage;
