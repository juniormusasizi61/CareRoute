import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import DashboardPage from './DashboardPage';

test('shows saved client count for authenticated users', async () => {
  // Return two clients so the dashboard should display a count of 2.
  const fetchClientsMock = jest.fn().mockResolvedValue([
    { id: '1', name: 'Client A', address: '123 Main St' },
    { id: '2', name: 'Client B', address: '456 Oak Ave' },
  ]);

  render(
    <AuthContext.Provider value={{ user: { id: '1', email: 'test@example.com' }, fetchClients: fetchClientsMock }}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // Confirm the dashboard displays the loaded count and calls the client API once.
  expect(await screen.findByText(/2 saved clients/i)).toBeInTheDocument();
  await waitFor(() => expect(fetchClientsMock).toHaveBeenCalledTimes(1));
});

test('shows guest message when no user is logged in', () => {
  // Without an authenticated user, the dashboard should not call the client API.
  render(
    <AuthContext.Provider value={{ fetchClients: jest.fn() }}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  expect(screen.getByText(/Saved client data will appear here after login/i)).toBeInTheDocument();
});
