import React, { useState } from 'react';
import api from '../api';

export default function Register({
  onSwitchToLogin,
}: {
  onSwitchToLogin: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { email, password, role });
      setMessage('Registration successful. Please login.');
    } catch {
      setMessage('Registration failed.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
        <option value="hod">HOD</option>
        <option value="superadmin">Superadmin</option>
      </select>
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
      <p>
        Already have an account? <button onClick={onSwitchToLogin}>Login here</button>
      </p>
    </div>
  );
}
