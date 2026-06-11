import React, { createContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Restore auth state from local storage for persistent sessions.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Persist token to local storage when it changes.
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // Persist user metadata to local storage when it changes.
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Generic request helper that attaches auth headers and parses JSON responses.
  const request = useCallback(
    async (path, options = {}) => {
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${apiBase}${path}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Request failed');
      }

      return res.json();
    },
    [apiBase, token]
  );

  // Authenticate existing user credentials and keep the session state.
  const login = useCallback(
    async (email, password) => {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token || null);
      setUser(data.user || { email });
      return data;
    },
    [request]
  );

  // Register a new user and persist the returned auth session.
  const register = useCallback(
    async (name, email, password) => {
      const data = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setToken(data.token || null);
      setUser(data.user || { name, email });
      return data;
    },
    [request]
  );

  // API helpers for client data.
  const fetchClients = useCallback(async () => request('/api/clients'), [request]);
  const createClient = useCallback(async (client) => request('/api/clients', {
    method: 'POST',
    body: JSON.stringify(client),
  }), [request]);
  // Delete a saved client by id using the authenticated request helper.
  const deleteClient = useCallback(async (clientId) => request(`/api/clients/${clientId}`, {
    method: 'DELETE',
  }), [request]);

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, fetchClients, createClient, deleteClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
