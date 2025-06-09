import React, { useEffect, useState } from 'react';
import api from './api';
import AppRoutes from './AppRoutes';

export default function App() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/check')
      .then(res => setRole(res.data.role))
      .catch(() => setRole(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
      <AppRoutes role={role} setRole={setRole} />
  );
}
