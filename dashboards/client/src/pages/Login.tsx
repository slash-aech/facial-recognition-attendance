import { useState } from 'react';
import api from '../api';
import '../styles/Login.css'

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
    <div className="auth-container">
  <div className="auth-card">
    <h1 className="auth-title">Welcome Back</h1>
    <p className="auth-subtitle">Sign in to access your account</p>
    
    <div className="auth-form">
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="auth-input"
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          className="auth-input"
        />
      </div>
      
      <button 
        onClick={handleLogin}
        className="auth-button primary"
      >
        Login
      </button>
      
      {message && <p className="auth-message">{message}</p>}
    </div>
    
    <div className="auth-footer">
      <p>Don't have an account?</p>
      <button 
        onClick={onSwitchToRegister}
        className="auth-button text-button"
      >
        Register here
      </button>
    </div>
  </div>
</div>
  );
}
