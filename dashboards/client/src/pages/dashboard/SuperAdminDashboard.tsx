import  { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import api from '../../api';
import type { Classroom, AttendanceRecord } from '../../types';
import '../../styles/SuperAdminDashboard.css'

export default function SuperadminDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [message, setMessage] = useState('');

 useEffect(() => {
    api.get('/auth/check')
 });


 useEffect(() => {
  api.get('/classrooms')
    .then(res => {
      // console.log('DATA:', res.data);
      if (Array.isArray(res.data)) {
        setClassrooms(res.data);
      } else {
        setClassrooms([res.data]); // or res.data.classrooms if wrapped
      }
    })
    .catch(() => setMessage('Failed to load classrooms'));
  }, []);
  
  // useEffect(() => {
  //   console.log("Updated classrooms:", classrooms);
  // }, [classrooms]);


  // Load classrooms on mount
  // useEffect(() => {
  //   api.get<Classroom[]>('/classrooms')
  //   .then(res => {
  //     setClassrooms(res.data);
  //     console.log("Fetched classrooms:", res.data);
  //     if (!Array.isArray(setClassrooms([res.data]))) {
  //       setMessage("Expected an array but got something else");
  //       return;
  //     }
  //   })
  //   .catch((err) => {
  //     console.error("Failed to load classrooms:", err);
  //     setMessage('Failed to load classrooms');
  //   });
  // }, []);
  // useEffect(() => {
  //   console.log("Updated classrooms:", classrooms);
  // }, [classrooms]);

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
    <div className="superadmin-dashboard">
  <header className="dashboard-header">
    <h1 className="dashboard-title">Super Admin Dashboard</h1>
    <LogoutButton />
  </header>

  {message && <div className="alert-message">{message}</div>}

  <section className="classroom-section">
    <h2 className="section-title">Classrooms</h2>
    <div className="classroom-grid">
      {classrooms?.map(c => (
        <button
          key={c.id}
          className={`classroom-card ${selectedClassroomId === c.id ? 'active' : ''}`}
          onClick={() => setSelectedClassroomId(c.id)}
        >
          {c.name}
        </button>
      ))}
    </div>
  </section>

  {selectedClassroomId !== null && (
    <section className="attendance-section">
      <h2 className="section-title">Attendance Records</h2>
      
      {attendance.length === 0 ? (
        <div className="empty-state">No attendance records yet</div>
      ) : (
        <div className="attendance-list">
          {attendance.map(a => (
            <div key={a.id} className="attendance-card">
              <div className="attendance-header">
                <span className="user-email">{a.email}</span>
                <span className="attendance-time">
                  {new Date(a.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="attendance-meta">
                <span className="location">
                  <i className="fas fa-map-marker-alt"></i> 
                  {a.latitude}, {a.longitude}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )}
</div>
  );
}
