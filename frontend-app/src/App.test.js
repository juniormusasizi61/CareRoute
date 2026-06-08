import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from './contexts/AuthContext';

import App from './App';

jest.mock('mapbox-gl', () => {
  const mapInstance = { remove: jest.fn() };
  const markerInstance = {
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
  };

  return {
    __esModule: true,
    default: {
      Map: jest.fn(() => mapInstance),
      Marker: jest.fn(() => markerInstance),
      accessToken: '',
    },
  };
});

test('renders the dashboard heading', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const headingElement = screen.getByRole('heading', { name: /dashboard/i });
  expect(headingElement).toBeInTheDocument();
});
