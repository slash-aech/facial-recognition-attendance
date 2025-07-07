import { useEffect, useState } from 'react';
import api from '../../api';

export default function StudentProfile() {
  const [student, setStudent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user_id = localStorage.getItem('userInfo');
      try {
        const res = await api.get('/profile', { params: { user_id } });
        setStudent(res.data);
      } catch (err) {
        console.error('❌ Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Segoe UI, sans-serif',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white'
    }}>
      <main style={{ flexGrow: 1, padding: '30px', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Your Profile</h1>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '12px',
          maxWidth: '600px'
        }}>
          {Object.entries(student).map(([key, value]) => (
            <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</p>
          ))}
        </div>
      </main>
    </div>
  );
}
