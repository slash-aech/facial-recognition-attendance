// frontend/src/pages/AdminDashboard.tsx
import React from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); // call backend logout
      localStorage.removeItem('token'); // remove token from storage
      navigate('/login'); // redirect to login page
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>This page is for managers only.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
