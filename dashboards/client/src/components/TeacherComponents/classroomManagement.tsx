// components/ClassroomManagement.tsx
import { useState, useEffect } from 'react';
import api from '../../api';
import styles from  '../../styles/SuperAdminDashboard.module.css';
import type { Classroom, AttendanceRecord } from '../../types';

const ClassroomManagement = () => {
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [message, setMessage] = useState<string>('');

  const fetchClassrooms = () => {
    setMessage('Loading classrooms...');
    api.get('/classrooms/all')
      .then(res => {
        if (Array.isArray(res.data)) setClassrooms(res.data);
        else setClassrooms([res.data]);
        setMessage('');
      })
      .catch(() => setMessage('Failed to load classrooms'));
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassroomId !== null) {
      api.get(`/attendance/classroom/${selectedClassroomId}`)
        .then(res => setAttendance(res.data))
        .catch(() => setAttendance([]));
    }
  }, [selectedClassroomId]);

  const startAttendance = (classroom: Classroom) => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const radiusInput = prompt('Enter attendance radius in meters (default: 100):', '100');
        const radius = parseInt(radiusInput || '100', 10);
        api.patch(`/classrooms/${classroom.id}/start`, { latitude, longitude, radius })
          .then(() => {
            setMessage(`Started attendance for ${classroom.name}`);
            fetchClassrooms();
          })
          .catch(() => setMessage('Failed to start attendance'));
      },
      () => alert('Location permission is required to start attendance')
    );
  };

  const stopAttendance = (classroom: Classroom) => {
    api.patch(`/classrooms/${classroom.id}/stop`)
      .then(() => {
        setMessage(`Stopped attendance for ${classroom.name}`);
        fetchClassrooms();
      })
      .catch(() => setMessage('Failed to stop attendance'));
  };

  return (
    <div className={styles.sectionWrapper}>
      <h2 className={styles.sectionTitle}>Classroom Management</h2>
      {message && <p>{message}</p>}
      <ul className={styles.classroomList}>
        {classrooms.map((c) => (
          <li
            key={c.id}
            className={`${styles.gridItem} ${selectedClassroomId === c.id ? styles.activeItem : ''}`}
            onClick={() => setSelectedClassroomId(c.id)}
          >
            {c.name} - Radius: {c.radius} meters
            <div>
              <button onClick={() => startAttendance(c)} className={styles.startBtn}>Start</button>
              <button onClick={() => stopAttendance(c)} className={styles.stopBtn}>Stop</button>
            </div>
          </li>
        ))}
      </ul>
      {selectedClassroomId && (
        <div className={styles.attendanceRecord}>
          <h3>Attendance Records</h3>
          <ul>
            {attendance.map((record) => (
              <li key={record.id}>{record.email} - {record.timestamp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClassroomManagement;
