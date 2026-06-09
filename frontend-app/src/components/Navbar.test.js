import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import Navbar from './Navbar';

test('displays client count in the navbar for authenticated users', async () => {
  const mockUser = { id: '1', name: 'Jane Smith', email: 'jane@example.com' };
  const fetchClientsMock = jest.fn().mockResolvedValue([
    { id: '1', name: 'Client A', address: '123 Main St' },
    { id: '2', name: 'Client B', address: '456 Oak Ave' },
  ]);

  render(
    <AuthContext.Provider value={{ user: mockUser, fetchClients: fetchClientsMock, logout: jest.fn() }}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // Wait for client data to load and verify the count is displayed in the navbar.
  await waitFor(() => expect(fetchClientsMock).toHaveBeenCalled());
  expect(await screen.findByText(/Clients: 2/i)).toBeInTheDocument();
});
