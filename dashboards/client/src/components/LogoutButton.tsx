// src/components/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import api from '../api';


export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      // window.location.reload(); 
      // Redirect to login or home after logout
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: '1rem', color: 'white'}}>
      Logout
    </button>
  );
}
