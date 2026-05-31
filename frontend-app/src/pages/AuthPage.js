import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
  // Simple UI mode switch; routing stays on a single auth page.
  const [mode, setMode] = useState('login');
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
