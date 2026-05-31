import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => (
  <div>
    <h2>Dashboard</h2>
    <p>Welcome to CareRoute — choose an action below to get started.</p>
    <ul>
      <li><Link to="/input">Add clients & schedules</Link></li>
      <li><Link to="/map">View routes on map</Link></li>
    </ul>
  </div>
);

export default DashboardPage;
