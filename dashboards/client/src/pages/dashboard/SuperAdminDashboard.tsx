import  { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import api from '../../api';
import type { Classroom, AttendanceRecord } from '../../types';
import '../../styles/SuperAdminDashboard.css'

export default function SuperadminDashboard() {



  const [timetableSheetUrl, setTSheetUrl] = useState('');
  const [studentSheetUrl, setSSheetUrl] = useState('');
  const [facultySheetUrl, setFSheetUrl] = useState('');
  const [timetableUploadMessage, setTUploadMessage] = useState('');
  const [studentUploadMessage, setSUploadMessage] = useState('');
  const [facultyUploadMessage, setFUploadMessage] = useState('');
  
  const extractSheetId = (url: string): string | null => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };
  
  const handleTimetableUploadSheet = async () => {
    const sheetId = extractSheetId(timetableSheetUrl);
    if (!sheetId) {
      setTUploadMessage('Invalid Google Sheet URL');
      return;
    }
  
    try {
      const response = await api.post('/timetable/upload', { sheetId });
      setTUploadMessage(response.data?.message || 'Sheet uploaded successfully');
    } catch (err) {
      console.error(err);
      setTUploadMessage('Failed to upload sheet (Maybe wrong format or incomplete field)');
    }
  };
  const handleStudentUploadSheet = async () => {
    const sheetId = extractSheetId(studentSheetUrl);
    if (!sheetId) {
      setSUploadMessage('Invalid Google Sheet URL');
      return;
    }
  
    try {
      const response = await api.post('/student/data', { sheetId });
      setSUploadMessage(response.data?.message || 'Sheet uploaded successfully');
    } catch (err) {
      console.error(err);
      setSUploadMessage('Failed to upload sheet (Maybe wrong format or incomplete field)');
    }
  };
  const handleFacultyUploadSheet = async () => {
    const sheetId = extractSheetId(facultySheetUrl);
    if (!sheetId) {
      setFUploadMessage('Invalid Google Sheet URL');
      return;
    }
  
    try {
      const response = await api.post('/faculty/upload', { sheetId });
      setFUploadMessage(response.data?.message || 'Sheet uploaded successfully');
    } catch (err) {
      console.error(err);
      setFUploadMessage('Failed to upload sheet (Maybe wrong format or incomplete field)');
    }
  };



const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
useEffect(() => {
  if (selectedClassroomId !== null) {
    api.get(`/attendance/classroom/${selectedClassroomId}`)
      .then(res => setAttendance(res.data))
      .catch(() => setAttendance([]));
  }
}, [selectedClassroomId]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [message, setMessage] = useState('');

  const fetchClassrooms = async () => {
  setMessage('Loading classrooms...');
  try {
    const res = await api.get('/classrooms/all');
    const data = res.data;

    if (Array.isArray(data)) {
      setClassrooms(data);
    } else {
      setClassrooms([data]);
    }

    console.log(data);
    setMessage('');
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    setMessage('Failed to load classrooms');
  }
};

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const startAttendance = (classroom: Classroom) => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    console.log("Hey you actually did something");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("good lord it is working until it isn't");
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
   <div className="dark-admin-dashboard">
  {/* Header with gradient border */}
  <header className="dashboard-header">
    <h1 className="gradient-title">
      <span className="title-highlight">Super Admin</span> Dashboard
    </h1>
    <LogoutButton />
  </header>

  {/* Notification system */}
  {message && (
    <div className="notification-bubble">
      <i className="fas fa-info-circle"></i> {message}
    </div>
  )}

  {/* Upload sections with glassmorphism effect */}
  <section className="upload-section glass-card">
    <h2 className="section-title">
      <i className="fas fa-table"></i> Upload Timetable
    </h2>
    <div className="upload-controls">
      <input
        type="text"
        placeholder="Paste Google Sheet URL"
        value={timetableSheetUrl}
        onChange={(e) => setTSheetUrl(e.target.value)}
        className="glass-input"
      />
      <button 
        onClick={handleTimetableUploadSheet} 
        className="gradient-button"
      >
        <i className="fas fa-cloud-upload-alt"></i> Upload
      </button>
    </div>
    {timetableUploadMessage && (
      <div className="status-message">{timetableUploadMessage}</div>
    )}
  </section>

  <section className="upload-section glass-card">
    <h2 className="section-title">
      <i className="fas fa-users"></i> Upload Student Data
    </h2>
    <div className="upload-controls">
      <input
        type="text"
        placeholder="Paste Google Sheet URL"
        value={studentSheetUrl}
        onChange={(e) => setSSheetUrl(e.target.value)}
        className="glass-input"
      />
      <button 
        onClick={handleStudentUploadSheet} 
        className="gradient-button"
      >
        <i className="fas fa-cloud-upload-alt"></i> Upload
      </button>
    </div>
    {studentUploadMessage && (
      <div className="status-message">{studentUploadMessage}</div>
    )}
  </section>





  <section className="upload-section glass-card">
    <h2 className="section-title">
      <i className="fas fa-table"></i> Upload Faculty Map
    </h2>
    <div className="upload-controls">
      <input
        type="text"
        placeholder="Paste Google Sheet URL"
        value={facultySheetUrl}
        onChange={(e) => setFSheetUrl(e.target.value)}
        className="glass-input"
      />
      <button 
        onClick={handleFacultyUploadSheet} 
        className="gradient-button"
      >
        <i className="fas fa-cloud-upload-alt"></i> Upload
      </button>
    </div>
    {facultyUploadMessage && (
      <div className="status-message">{facultyUploadMessage}</div>
    )}
  </section>








  
  <div className="classroom-list">
        <h2>All Classrooms</h2>
        <ul>
          {classrooms.filter(c => c.id).map(c => (
            <li key={c.id} className="classroom-card">
              <p><strong>{c.name}</strong></p>
              <p>Status: <span style={{ color: c.is_active ? 'green' : 'red' }}>
                {c.is_active ? 'Active' : 'Inactive'}
              </span></p>
              <p>Radius: {c.radius}m</p>
              {c.latitude && c.longitude && (
                <p>Location: {c.latitude.toFixed(5)}, {c.longitude.toFixed(5)}</p>
              )}
              {c.is_active ? (
                <button onClick={() => stopAttendance(c)} className="stop-btn">Stop Attendance</button>
              ) : (
                <button onClick={() => startAttendance(c)} className="start-btn">Start Attendance</button>
              )}
            </li>
          ))}
        </ul>
  </div>

  {/* Classroom grid */}
  <section className="glass-card">
    <h2 className="section-title">
      <i className="fas fa-chalkboard"></i> Classrooms
    </h2>
    <div className="grid-layout">
      {classrooms.filter(c => c.id).map(c => (
        <div
          key={c.id}
          className={`grid-item ${selectedClassroomId === c.id ? 'active-item' : ''}`}
          onClick={() => setSelectedClassroomId(c.id)}
        >
          <div className="item-content">
            <i className="fas fa-door-open"></i>
            {c.name}
          </div>
        </div>
      ))}
    </div>
  </section>
      


  {/* Attendance records */}
  {selectedClassroomId !== null && (
    <section className="glass-card">
      <h2 className="section-title">
        <i className="fas fa-clipboard-check"></i> Attendance Records
      </h2>
      
      {attendance.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-search-minus"></i> No records found
        </div>
      ) : (
        <div className="data-table">
          <div className="table-header">
            <span>Student</span>
            <span>Time</span>
            <span>Location</span>
          </div>
          {attendance.filter(a => a.id).map(a => (
            <div key={a.id} className="table-row">
              <span className="user-cell">
                <i className="fas fa-user-graduate"></i> {a.email}
              </span>
              <span className="time-cell">
                {new Date(a.timestamp).toLocaleString()}
              </span>
              <span className="location-cell">
                <i className="fas fa-map-pin"></i> {a.latitude}, {a.longitude}
              </span>
            </div>))}
        </div>)}
    </section>
  )}
</div>
  );
}
