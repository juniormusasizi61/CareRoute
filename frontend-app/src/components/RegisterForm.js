import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset stale API errors before a new submit attempt.
    setError(null);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      </div>
      <div style={{ marginTop: 8 }}>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit">Register</button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default RegisterForm;
