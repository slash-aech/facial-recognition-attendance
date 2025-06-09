import  { useEffect, useState } from 'react';
import api from '../../api';
import type { Classroom, AttendanceRecord } from '../../types';
import LogoutButton from '../../components/LogoutButton';

export default function TeacherDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get<Classroom[]>('/classrooms')
      .then(res => setClassrooms(res.data))
      .catch(() => setMessage('Failed to load classrooms'));
  }, []);

  useEffect(() => {
    if (selectedClassroomId === null) return;
    api.get<AttendanceRecord[]>(`/attendance/${selectedClassroomId}`)
      .then(res => setAttendance(res.data))
      .catch(() => setMessage('Failed to load attendance'));
  }, [selectedClassroomId]);

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      {message && <p>{message}</p>}

      <h3>Classes</h3>
      <ul>
        {classrooms.map(c => (
          <li key={c.id}>
            <button onClick={() => setSelectedClassroomId(c.id)}>{c.name}</button>
          </li>
        ))}
      </ul>

      {selectedClassroomId !== null && (
        <>
          <h3>Attendance for selected class</h3>
          <ul>
            {attendance.length === 0 && <li>No attendance records yet.</li>}
            {attendance.map(a => (
              <li key={a.id}>
                {a.studentEmail} - {new Date(a.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
            <LogoutButton />
      
    </div>
  );
}
