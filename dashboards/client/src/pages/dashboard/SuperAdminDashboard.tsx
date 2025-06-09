import  { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import api from '../../api';
import type { Classroom, AttendanceRecord } from '../../types';

export default function SuperadminDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [message, setMessage] = useState('');

  // Load classrooms on mount
  useEffect(() => {
    api.get<Classroom[]>('/classrooms')
      .then(res => setClassrooms(res.data))
      .catch(() => setMessage('Failed to load classrooms'));
  }, []);

  // Load attendance when classroom is selected
  useEffect(() => {
    if (selectedClassroomId === null) return;

    api.get<AttendanceRecord[]>(`/attendance/records?classroom_id=${selectedClassroomId}`)
      .then(res => {
        setAttendance(res.data)
        console.log(res.data);
  })
      .catch(() => setMessage('Failed to load attendance'));
  }, [selectedClassroomId]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Super Admin Dashboard</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      <h3>Classrooms</h3>
      <ul>
        {classrooms.map(c => (
          <li key={c.id}>
            <button onClick={() => setSelectedClassroomId(c.id)}>
              {c.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedClassroomId !== null && (
        <>
          <h3>Attendance Records</h3>
          <ul>
            {attendance.length === 0 ? (
              <li>No attendance records yet.</li>
            ) : (
              attendance.map(a => (
                <li key={a.id}>
                  <strong>{a.email}</strong> - {new Date(a.timestamp).toLocaleString()}
                  <br />
                  Location: {a.latitude}, {a.longitude}
                </li>
              ))
            )}
          </ul>
        </>
      )}

      <LogoutButton/>
    </div>
  );
}
