import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AuthContext, { AuthProvider } from './contexts/AuthContext';

import App from './App';

// Mock Mapbox so App tests do not try to initialize a real map.
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

test('shows personalized greeting with user name on dashboard when logged in', async () => {
  const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
  // Provide a complete auth context so App renders the logged-in dashboard branch.
  const authValue = {
    user: mockUser,
    token: 'token',
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    fetchClients: jest.fn().mockResolvedValue([]),
    createClient: jest.fn(),
  };

  // Wrap rendering in act because App starts async client-count loading.
  await act(async () => {
    render(
      <AuthContext.Provider value={authValue}>
        <App />
      </AuthContext.Provider>
    );
  });

  expect(await screen.findByText(/Welcome back, John Doe!/i)).toBeInTheDocument();
});
