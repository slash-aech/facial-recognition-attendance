// src/components/LogoutButton.tsx
import api from '../../api';


export default function LogoutButton() {

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      window.location.reload();
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
