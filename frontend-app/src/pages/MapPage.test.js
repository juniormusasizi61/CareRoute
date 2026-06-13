import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import MapPage from './MapPage';

jest.mock('mapbox-gl', () => {
  // Keep map initialization out of unit tests by providing a lightweight mock.
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

test('shows setup message when Mapbox token is missing', async () => {
  // With no token, the map container should be replaced by setup guidance.
  const fetchClientsMock = jest.fn().mockResolvedValue([]);

  await act(async () => {
    render(
      <AuthContext.Provider value={{ user: { id: '1', email: 'test@example.com' }, fetchClients: fetchClientsMock }}>
        <MemoryRouter>
          <MapPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });

  expect(screen.getByText(/Mapbox token is not configured/i)).toBeInTheDocument();
  expect(screen.queryByTestId('map-container')).not.toBeInTheDocument();
});

test('shows client notes in the saved clients list', async () => {
  // Use a note value that should be visible in the saved clients list.
  const fetchClientsMock = jest.fn().mockResolvedValue([
    { id: '1', name: 'Client A', address: '123 Main St', notes: 'Gate code 1234' },
  ]);

  await act(async () => {
    render(
      <AuthContext.Provider value={{ user: { id: '1', email: 'test@example.com' }, fetchClients: fetchClientsMock }}>
        <MemoryRouter>
          <MapPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });

  expect(screen.getByText(/Gate code 1234/i)).toBeInTheDocument();
});
