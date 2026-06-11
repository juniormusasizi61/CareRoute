import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { act } from 'react';
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

test('disables the save button while a client save request is in progress', async () => {
  let resolveSave;
  const fetchClientsMock = jest.fn().mockResolvedValue([]);
  const createClientMock = jest.fn(() => new Promise((resolve) => {
    resolveSave = resolve;
  }));

  render(
    <AuthContext.Provider value={{ user: { id: '1', email: 'test@example.com' }, fetchClients: fetchClientsMock, createClient: createClientMock }}>
      <InputPage />
    </AuthContext.Provider>
  );

  await waitFor(() => expect(fetchClientsMock).toHaveBeenCalled());

  fireEvent.change(screen.getByPlaceholderText(/Client name/i), { target: { value: 'Client A' } });
  fireEvent.change(screen.getByPlaceholderText(/Address/i), { target: { value: '123 Main St' } });
  const saveButton = screen.getByRole('button', { name: /save/i });

  fireEvent.click(saveButton);

  // Confirm the button is disabled while the createClient promise is unresolved.
  await waitFor(() => expect(saveButton).toBeDisabled());
  expect(saveButton).toHaveTextContent(/Saving.../i);

  await act(async () => {
    resolveSave({ id: '1', name: 'Client A', address: '123 Main St' });
  });

  expect(await screen.findByText('Client A', { exact: true })).toBeInTheDocument();
});

test('shows a success message when a client is saved successfully', async () => {
  let resolveSave;
  const fetchClientsMock = jest.fn().mockResolvedValue([]);
  const createClientMock = jest.fn(() => new Promise((resolve) => {
    resolveSave = resolve;
  }));

  render(
    <AuthContext.Provider value={{ user: { id: '1', email: 'test@example.com' }, fetchClients: fetchClientsMock, createClient: createClientMock }}>
      <InputPage />
    </AuthContext.Provider>
  );

  await waitFor(() => expect(fetchClientsMock).toHaveBeenCalled());

  fireEvent.change(screen.getByPlaceholderText(/Client name/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByPlaceholderText(/Address/i), { target: { value: '789 Pine Rd' } });
  const saveButton = screen.getByRole('button', { name: /save/i });

  fireEvent.click(saveButton);

  await act(async () => {
    resolveSave({ id: '2', name: 'Jane Doe', address: '789 Pine Rd' });
  });

  expect(screen.getByText(/Jane Doe has been added successfully/i)).toBeInTheDocument();
});

test('removes a client from the list when delete succeeds', async () => {
  const fetchClientsMock = jest.fn().mockResolvedValue([
    { id: '1', name: 'Client A', address: '123 Main St' },
  ]);
  const deleteClientMock = jest.fn().mockResolvedValue({});

  // Mock confirmation so the delete action can proceed without a browser prompt.
  window.confirm = jest.fn(() => true);

  render(
    <AuthContext.Provider value={{
      user: { id: '1', email: 'test@example.com' },
      fetchClients: fetchClientsMock,
      createClient: jest.fn(),
      deleteClient: deleteClientMock,
    }}>
      <InputPage />
    </AuthContext.Provider>
  );

  await waitFor(() => expect(fetchClientsMock).toHaveBeenCalled());
  expect(await screen.findByText('Client A', { exact: true })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /delete/i }));

  expect(deleteClientMock).toHaveBeenCalledWith('1');
  // Verify both the success message and the updated empty list state.
  expect(await screen.findByText(/Client A has been deleted/i)).toBeInTheDocument();
  expect(await screen.findByText('No saved clients yet.')).toBeInTheDocument();
});
