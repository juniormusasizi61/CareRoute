import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AuthContext from '../contexts/AuthContext';
import LoginForm from './LoginForm';

test('disables submit and shows loading state during login request', async () => {
  const loginMock = jest.fn(
    () => new Promise((resolve) => setTimeout(resolve, 50))
  );

  render(
    <AuthContext.Provider value={{ login: loginMock }}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByPlaceholderText(/password/i), 'password');

  const submitButton = screen.getByRole('button', { name: /login/i });
  await userEvent.click(submitButton);

  expect(submitButton).toBeDisabled();
  expect(submitButton).toHaveTextContent(/logging in.../i);

  await waitFor(() => expect(loginMock).toHaveBeenCalledTimes(1));
});
