// frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { LoginResponse } from '../types';

export default function Login({
  setToken,
  setRole
}: {
  setToken: (t: string) => void;
  setRole: (r: string) => void;
}) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post<LoginResponse>('/auth/login', {
        email,
        password
      });
      setToken(res.data.accessToken);
      setRole(res.data.role);

      // Redirect to dashboard based on role
      switch (res.data.role) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'manager':
          navigate('/dashboard/manager');
          break;
        case 'editor':
          navigate('/dashboard/editor');
          break;
        case 'user':
          navigate('/dashboard/user');
          break;
        case 'guest':
          navigate('/dashboard/guest');
          break;
        default:
          navigate('/');
      }
    } catch {
      setMessage('Login failed. Check credentials.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <div>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password: </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
}
