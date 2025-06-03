import React, { useState } from 'react';
import api from './api';

export default function Protected({ token }: { token: string }) {
  const [data, setData] = useState('');

  // You can have different buttons for different roles or just one fetch that backend controls
  const fetchAdminData = async () => {
    try {
      const res = await api.get('/api/protected/admin-only', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.message);
    } catch (err) {
      setData('Unauthorized or token expired');
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await api.get('/api/protected/user-only', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.message);
    } catch (err) {
      setData('Unauthorized or token expired');
    }
  };

  return (
    <div>
      <h2>Protected</h2>
      <button onClick={fetchAdminData}>Get Admin Data</button>
      <button onClick={fetchUserData}>Get User Data</button>
      <p>{data}</p>
    </div>
  );
}