import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AuthContext from '../contexts/AuthContext';
import RegisterForm from './RegisterForm';

test('disables submit and shows loading state during registration request', async () => {
  const registerMock = jest.fn(
    () => new Promise((resolve) => setTimeout(resolve, 50))
  );

  render(
    <AuthContext.Provider value={{ register: registerMock }}>
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  await userEvent.type(screen.getByPlaceholderText(/full name/i), 'Test User');
  await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByPlaceholderText(/password/i), 'password');

  const submitButton = screen.getByRole('button', { name: /register/i });
  await userEvent.click(submitButton);

  expect(submitButton).toBeDisabled();
  expect(submitButton).toHaveTextContent(/registering.../i);

  await waitFor(() => expect(registerMock).toHaveBeenCalledTimes(1));
});
