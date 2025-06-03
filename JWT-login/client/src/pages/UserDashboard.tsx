// frontend/src/pages/UserDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 


export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };
  return (
    <div>
     <div style={{ padding: 20 }}>
      <h1>User Dashboard</h1>
      <p>This page is for regular users only.</p>
    </div>
  <button onClick={handleLogout}>Logout</button>;
  </div>
  );
}

