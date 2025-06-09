import React, { useState } from 'react';
import api from '../api';

export default function Login({
  onLogin,
  onSwitchToRegister,
}: {
  onLogin: (role: string) => void;
  onSwitchToRegister: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data.role);
    } catch {
      setMessage('Login failed.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
      <p>
        Don’t have an account? <button onClick={onSwitchToRegister}>Register here</button>
      </p>
    </div>
  );
}
