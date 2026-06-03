import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import AuthContext from '../contexts/AuthContext';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If the user is already authenticated, send them to the dashboard.
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setMode('login')} disabled={mode === 'login'}>Login</button>
        <button onClick={() => setMode('register')} disabled={mode === 'register'} style={{ marginLeft: 8 }}>Register</button>
      </div>
      {mode === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default AuthPage;
