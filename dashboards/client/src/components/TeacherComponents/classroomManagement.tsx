import { useState, useEffect } from 'react';
import api from '../../api';
import styles from '../../styles/SuperAdminDashboard.module.css';

interface ClassroomEntry {
  lesson_id: string;  // ✅ Add this
  classroom_id: string;
  classroom_name: string;
  subject: string;
  start_time: string;
  end_time: string;
  period: string;
  active: boolean;
}



const ClassroomManagement = () => {
  const userId = localStorage.getItem('userInfo');
  console.log(`👤 User ID from localStorage: ${userId}`);
  const [classrooms, setClassrooms] = useState<ClassroomEntry[]>([]);
  const [message, setMessage] = useState<string>('');

  const fetchTodayTimetable = async () => {
  try {
    const todayDate = new Date().toISOString().slice(0, 10); // e.g. '2025-07-15'
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    console.log(`📅 Fetching today's timetable for: ${todayDate}, user_id: ${userId}`);

    const res = await api.get(`/faculty-attendance/faculty/active-today`, {
      params: { user_id: userId, day, date: todayDate } // ✅ pass both
    });

    const rawData = res.data || [];

    rawData.sort((a: ClassroomEntry, b: ClassroomEntry) =>
      a.start_time.localeCompare(b.start_time)
    );

    const collapsed: ClassroomEntry[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const current = rawData[i];

      if (
        collapsed.length > 0 &&
        current.classroom_id === collapsed[collapsed.length - 1].classroom_id &&
        current.subject === collapsed[collapsed.length - 1].subject &&
        current.start_time === collapsed[collapsed.length - 1].end_time
      ) {
        collapsed[collapsed.length - 1].end_time = current.end_time;
      } else {
        collapsed.push({ ...current });
      }
    }

    setClassrooms(collapsed);
    setMessage('');
  } catch (err) {
    setMessage('Failed to load today\'s classes');
  }
};


  useEffect(() => {
    fetchTodayTimetable();
  }, []);

  const startAttendance = (classroomId: string, period: string, lessonId: string) => {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }

  if (!userId) {
    alert('User ID missing');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      const radiusInput = prompt('Enter attendance radius in meters (default: 5):', '5');
      const radius = parseInt(radiusInput || '5', 10);

      const payload = { latitude, longitude, radius, userId, period, lesson_id: lessonId }; // ✅ Add lesson_id
      console.log('📦 Sending PATCH /start with payload:', payload);

      try {
        console.log(`📍 Starting attendance for classroom ${classroomId} at period ${period}`);
        await api.patch(`/classrooms/${classroomId}/start`, payload);
        console.log('✅ Attendance started successfully');
        setMessage('Attendance started');
        fetchTodayTimetable();
      } catch (err) {
        console.error('❌ Failed to start attendance:', err);
        setMessage('Failed to start attendance');
      }
    },
    (error) => {
      alert(`Location permission is required to start attendance\n - ${error}`);
    }
  );
};


  const stopAttendance = async (classroomId: string) => {
    // console.log(`🛑 Stopping attendance for classroom ${classroomId}`);
    try {
      await api.patch(`/classrooms/${classroomId}/stop`, {user_id:userId});
      // console.log('✅ Attendance stopped:', res.data);
      setMessage('Attendance stopped');
      fetchTodayTimetable();
    } catch (err) {
      // console.error('❌ Failed to stop attendance:', err);
      setMessage('Failed to stop attendance');
    }
  };

  return (
    <div className={styles.sectionWrapper}>
      <h2 className={styles.sectionTitle}>Today's Classes - Attendance Management</h2>
      {message && <p>{message}</p>}

      {classrooms.length === 0 ? (
        <p>No classes scheduled for today or attendance not started.</p>
      ) : (
        <ul className={styles.classroomList}>
          {classrooms.map((c) => (
            <li key={`${c.classroom_id}-${c.period}`} className={styles.gridItem}>
              <div><strong>{c.subject}</strong> in {c.classroom_name}</div>
              <div>Time: {c.start_time} - {c.end_time}</div>
              <div>Status: <span style={{ color: c.active ? 'green' : 'gray' }}>
                {c.active ? 'Ongoing' : 'Not Started'}
              </span></div>
              <div style={{ marginTop: '0.5rem' }}>
                <button
                onClick={() => startAttendance(c.classroom_id, c.period, c.lesson_id)}
                disabled={c.active}
                className={styles.startBtn}
              >
                Start
              </button>
                <button
                  onClick={() => stopAttendance(c.classroom_id)}
                  disabled={!c.active}
                  className={styles.stopBtn}
                >
                  Stop
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClassroomManagement;
