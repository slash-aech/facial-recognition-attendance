import { useEffect, useState } from 'react';
import api from '../../api';
import type { Classroom } from '../../types';
import '../../styles/StudentDashboard.css';

export default function StudentDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // ✅ Track loading status

  useEffect(() => {
    setMessage('Mark attendance in following class');

    api.get('/classrooms')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setClassrooms(data);
      })
      .catch(() => setMessage('Failed to load classrooms'))
      .finally(() => setLoading(false)); // ✅ Mark loading as complete
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
        .then(() => {
          setMessage(`Attendance marked for ${classroom.name}`);
          setLoading(true); // reload classrooms
          return api.get('/classrooms');
        })
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : [res.data];
          setClassrooms(data);
        })
        .catch(err => {
          if (err.response?.data?.error) setMessage(err.response.data.error);
          else setMessage('Failed to mark attendance');
        })
        .finally(() => setLoading(false));
      },
      () => alert('Some error occured, try checking location settings')
    );
  };

  return (
    <div>
      <p>{message}</p>
      {loading ? (
        <p>Loading classrooms...</p>
      ) :(
        <ul>
          {classrooms.filter(c => c.id).map(c => (
  <li key={c.id}>
    {c.name}
    <button onClick={() => markAttendance(c)}>Mark Attendance</button>
  </li>
))}
        </ul>
      )}
    </div>
  );
}