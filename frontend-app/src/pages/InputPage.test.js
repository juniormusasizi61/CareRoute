import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AuthContext from '../contexts/AuthContext';
import InputPage from './InputPage';

test('shows saved client count on the input page', async () => {
  const fetchClientsMock = jest.fn().mockResolvedValue([
    { id: '1', name: 'Client A', address: '123 Main St' },
  ]);

  render(
    <AuthContext.Provider value={{ user: { id: '1', email: 'test@example.com' }, fetchClients: fetchClientsMock, createClient: jest.fn() }}>
      <InputPage />
    </AuthContext.Provider>
  );

  // Wait for client data to load and ensure the new saved-client count UI is shown.
  await waitFor(() => expect(fetchClientsMock).toHaveBeenCalled());
  expect(await screen.findByText(/You have 1 saved client/i)).toBeInTheDocument();
});
