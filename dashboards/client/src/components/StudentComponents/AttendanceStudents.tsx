import { useEffect, useState } from 'react';
import api from '../../api';
import type { Classroom } from '../../types';
import '../../styles/SuperAdminDashboard.module.css';

const AttendanceComponent = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMessage('Mark attendance in following class');

    api.get('/classrooms')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setClassrooms(data);
      })
      .catch(() => setMessage('Failed to load classrooms'))
      .finally(() => setLoading(false));
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
          setLoading(true);
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
      () => alert('Some error occurred, try checking location settings')
    );
  };

  return (
    <div className="mainContent">
      <h1 className="gradient-title">
        <span className="title-highlight">Mark</span> Attendance
      </h1>

      {message && <div className="notification-bubble">{message}</div>}

      {loading ? (
        <p>Loading classrooms...</p>
      ) : (
        <ul>
          {classrooms.filter(c => c.id).map(c => (
            <li key={c.id}>
              {c.name}
              <button onClick={() => markAttendance(c)} className="uploadBtn">
                Mark Attendance
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttendanceComponent;