import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Restore persisted session on page refresh.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Persist auth token so API requests can survive reloads.
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // Keep user profile in sync with auth state.
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const login = async (email, password) => {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Login failed');
    }
    const data = await res.json();
    // Accept either token/accessToken shape for backend flexibility.
    setToken(data.token || data.accessToken || null);
    setUser(data.user || { email });
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Registration failed');
    }
    const data = await res.json();
    // Accept either token/accessToken shape for backend flexibility.
    setToken(data.token || data.accessToken || null);
    setUser(data.user || { name, email });
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
