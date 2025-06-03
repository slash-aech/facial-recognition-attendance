// frontend/src/pages/Register.tsx
import React, { useState } from 'react';
import api from '../api';

export default function Register() {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]       = useState<'admin' | 'manager' | 'editor' | 'user' | 'guest'>('user');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { email, password, role });
      setMessage('Registration successful. You may now log in.');
    } catch {
      setMessage('Registration failed (maybe email is taken).');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
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
      <div>
        <label>Role: </label>
        <select value={role} onChange={e => setRole(e.target.value as any)}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="editor">Editor</option>
          <option value="user">User</option>
          <option value="guest">Guest</option>
        </select>
      </div>
      <button onClick={handleRegister}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );
}