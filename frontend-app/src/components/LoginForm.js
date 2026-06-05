import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset stale API errors before a new submit attempt.
    setError(null);
    // Enter loading state to disable the button and show progress.
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      </div>
      <div style={{ marginTop: 8 }}>
        {/* Disable submit while the login request is in progress or when fields are incomplete. */}
        <button
          type="submit"
          disabled={loading || !form.email || !form.password}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default LoginForm;
