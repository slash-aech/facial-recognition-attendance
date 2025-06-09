import  { useEffect, useState } from 'react';
import api from '../../api';
import type { Classroom } from '../../types';
import LogoutButton from '../../components/LogoutButton'

export default function StudentDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get<Classroom[]>('/classrooms')
      .then(res => setClassrooms(res.data))
      .catch(() => setMessage('Failed to load classrooms'));
  }, []);

  const markAttendance = (classroom: Classroom) => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        
        api.post('/attendance/mark', {
          classroom_id: classroom.id,
          latitude,
          longitude
        })
        
        .then(() => setMessage(`Attendance marked for ${classroom.name}`))
        .catch(err => {
          if (err.response?.data?.error) setMessage(err.response.data.error);
          else setMessage('Failed to mark attendance');
        });
      },
      () => alert('Location permission required to mark attendance')
    );
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      {message && <p>{message}</p>}
      <ul>
        {classrooms.map(c => (
          <li key={c.id}>
            {c.name} - Radius: {c.radius} meters &nbsp;
            <button onClick={() => markAttendance(c)}>Mark Attendance</button>
          </li>
        ))}
      </ul>
            <LogoutButton/>
    </div>
  );
}
