import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from './contexts/AuthContext';
import AuthContext from './contexts/AuthContext';

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

test('shows personalized greeting with user name on dashboard when logged in', () => {
  const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };

  const CustomAuthProvider = ({ children }) => (
    <AuthContext.Provider value={{ user: mockUser, token: 'token', login: jest.fn(), register: jest.fn(), logout: jest.fn(), fetchClients: jest.fn(), createClient: jest.fn() }}>
      {children}
    </AuthContext.Provider>
  );

  render(
    <CustomAuthProvider>
      <App />
    </CustomAuthProvider>
  );
  expect(screen.getByText(/Welcome back, John Doe!/i)).toBeInTheDocument();
});
