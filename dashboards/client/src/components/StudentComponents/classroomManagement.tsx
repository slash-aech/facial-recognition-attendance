import { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/SuperAdminDashboard.module.css';

interface StudentClass {
  subject: string;
  startTime: string;
  endTime: string;
  day: string;
  period: number;
  classroom: string;
  classroom_id: string;
  class: string;
  group: string;
  attended: boolean;
}

const StudentAttendance = () => {
  const [classesToday, setClassesToday] = useState<StudentClass[]>([]);
  const [markingClassroomId, setMarkingClassroomId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem('userInfo')?.replace(/"/g, '');

  const fetchTodayClasses = async () => {
    if (!studentId) {
      setMessage('Missing user ID');
      return;
    }

    setLoading(true);
    try {
  const res = await api.get(`/student/attendance-timetable?user_id=${studentId}`);
  const data = res.data as StudentClass[];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const filtered = data.filter((entry) =>
  entry.day === today && !entry.attended
    );

    // Sort by classroom, subject, then start time
    filtered.sort((a, b) => {
      if (a.classroom_id === b.classroom_id && a.subject === b.subject) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });

    const collapsed: StudentClass[] = [];

    for (let i = 0; i < filtered.length; i++) {
      const current = filtered[i];

      if (
        collapsed.length > 0 &&
        current.classroom_id === collapsed[collapsed.length - 1].classroom_id &&
        current.subject === collapsed[collapsed.length - 1].subject &&
        current.startTime === collapsed[collapsed.length - 1].endTime
      ) {
        collapsed[collapsed.length - 1].endTime = current.endTime;
      } else {
        collapsed.push({ ...current });
      }
    }

    setClassesToday(collapsed);
  setMessage('');
} catch (err) {
      console.error('❌ Failed to fetch timetable:', err);
      setMessage('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (classroomId: string, period: number) => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    setMarkingClassroomId(classroomId);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        console.log(`sending data to server: ${latitude}, ${longitude} for classroom ${classroomId} at period ${period} with student ID ${studentId}`);

        try {
          const res = await api.post('/student-attendance/mark', {
            user_id: studentId,
            classroom_id: classroomId,
            latitude,
            longitude,
            period,
          });
          setMessage(res.data.message || 'Attendance marked');
          fetchTodayClasses(); // 🔁 Refresh
        } catch (err: any) {
          const msg = err.response?.data?.error || 'Failed to mark attendance';
          setMessage(msg);
        } finally {
          setMarkingClassroomId(null);
        }
      },
      () => {
        alert('Location permission denied');
        setMarkingClassroomId(null);
      }
    );
  };

  useEffect(() => {
    fetchTodayClasses();
  }, []);

  return (
    <div className="mainContent">
      <h1 className="gradient-title">
        <span className="title-highlight">Ongoing&apos;s</span> Classes
      </h1>

      {message && <div className="notification-bubble">{message}</div>}

      {loading ? (
        <p>Loading timetable...</p>
      ) : classesToday.length === 0 ? (
        <p>No active classes or already marked.</p>
      ) : (
        <ul className="classroomList">
          {classesToday.map((cls) => (
            <li key={`${cls.classroom_id}-${cls.period}`} className="gridItem">
              <div><strong>{cls.subject}</strong> in {cls.classroom}</div>
              <div>Time: {cls.startTime} - {cls.endTime}</div>
              <div>Class: {cls.class} | Group: {cls.group}</div>
              <button
                className="uploadBtn"
                disabled={markingClassroomId === cls.classroom_id}
                onClick={() => markAttendance(cls.classroom_id, cls.period)}
              >
                {markingClassroomId === cls.classroom_id ? 'Marking...' : 'Mark Attendance'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentAttendance;