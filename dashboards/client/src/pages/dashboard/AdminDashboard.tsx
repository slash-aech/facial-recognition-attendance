import { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import api from '../../api';
import type { Classroom, AttendanceRecord } from '../../types';
import '../../styles/SuperAdminDashboard.module.css'

export default function SuperadminDashboard() {
  const [academicYearFrom, setAcademicYearFrom] = useState('');
  const [academicYearTo, setAcademicYearTo] = useState('');
  const [semester, setSemester] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [uploadType, setUploadType] = useState<'xml' | 'sheet'>('xml');
  const [previewData, setPreviewData] = useState<{ row: number; data: string; status: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [timetableSheetUrl, setTSheetUrl] = useState('');
  const [studentSheetUrl, setSSheetUrl] = useState('');
  const [facultySheetUrl, setFSheetUrl] = useState('');
  const [timetableUploadMessage, setTUploadMessage] = useState('');
  const [studentUploadMessage, setSUploadMessage] = useState('');
  const [facultyUploadMessage, setFUploadMessage] = useState('');

  const institutes = ['Institute A', 'Institute B'];
  const faculties = ['Faculty 1', 'Faculty 2'];

  const extractSheetId = (url: string): string | null => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const handleTimetableUploadSheet = async () => {
    const sheetId = extractSheetId(timetableSheetUrl);
    if (!sheetId) return setTUploadMessage('Invalid Google Sheet URL');
    try {
      const res = await api.post('/timetable/upload', { sheetId });
      setTUploadMessage(res.data?.message || 'Sheet uploaded successfully');
    } catch {
      setTUploadMessage('Failed to upload sheet (Maybe wrong format or incomplete field)');
    }
  };

  const handleStudentUploadSheet = async () => {
    const sheetId = extractSheetId(studentSheetUrl);
    if (!sheetId) return setSUploadMessage('Invalid Google Sheet URL');
    try {
      const res = await api.post('/student/data', { sheetId });
      setSUploadMessage(res.data?.message || 'Sheet uploaded successfully');
    } catch {
      setSUploadMessage('Failed to upload sheet (Maybe wrong format or incomplete field)');
    }
  };

  const handleFacultyUploadSheet = async () => {
    const sheetId = extractSheetId(facultySheetUrl);
    if (!sheetId) return setFUploadMessage('Invalid Google Sheet URL');
    try {
      const res = await api.post('/faculty/upload', { sheetId });
      setFUploadMessage(res.data?.message || 'Sheet uploaded successfully');
    } catch {
      setFUploadMessage('Failed to upload sheet (Maybe wrong format or incomplete field)');
    }
  };

  function handleXMLUploadDummy(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewData([
        { row: 1, data: 'Math - Mon 10AM', status: 'Valid' },
        { row: 2, data: 'Physics - Tue 2PM', status: 'Valid' },
      ]);
    }
  }

  function startFakeUploadProgress() {
    setLoading(true);
    setProgress(0);
    let count = 0;
    const interval = setInterval(() => {
      count += 10;
      setProgress(count);
      if (count >= 100) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 300);
  }

  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [message, setMessage] = useState('');

  const fetchClassrooms = () => {
    setMessage('Loading classrooms...');
    api
      .get('/classrooms/all')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setClassrooms(res.data);
        } else {
          setClassrooms([res.data]);
        }
        setMessage('');
      })
      .catch(() => setMessage('Failed to load classrooms'));
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassroomId !== null) {
      api
        .get(`/attendance/classroom/${selectedClassroomId}`)
        .then((res) => setAttendance(res.data))
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
        api
          .patch(`/classrooms/${classroom.id}/start`, { latitude, longitude, radius })
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
    api
      .patch(`/classrooms/${classroom.id}/stop`)
      .then(() => {
        setMessage(`Stopped attendance for ${classroom.name}`);
        fetchClassrooms();
      })
      .catch(() => setMessage('Failed to stop attendance'));
  };

  return (
    <div className="dark-admin-dashboard">
      <header className="dashboard-header">
        <h1 className="gradient-title">
          <span className="title-highlight">Admin</span> Dashboard
        </h1>
        <div className="dashboard-filters glass-card">
          <div className="filter-group">
            <label>Institute:</label>
            <select value={selectedInstitute} onChange={(e) => setSelectedInstitute(e.target.value)}>
              <option value="">Select Institute</option>
              {institutes.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Faculty:</label>
            <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}>
              <option value="">Select Faculty</option>
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Academic Year:</label>
            <input type="text" placeholder="From (e.g., 2023)" value={academicYearFrom} onChange={(e) => setAcademicYearFrom(e.target.value)} />
            <input type="text" placeholder="To (e.g., 2024)" value={academicYearTo} onChange={(e) => setAcademicYearTo(e.target.value)} />
          </div>

          <div className="filter-group">
            <label>Semester:</label>
            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="">Select</option>
              <option value="odd">Odd</option>
              <option value="even">Even</option>
            </select>
          </div>
        </div>
        <LogoutButton />
      </header>

      {message && <div className="notification-bubble"><i className="fas fa-info-circle"></i> {message}</div>}

      {/* Timetable Upload */}
      <section className="upload-section glass-card">
        <h2 className="section-title"><i className="fas fa-table"></i> Upload Timetable</h2>
        <div className="upload-controls">
          <select value={uploadType} onChange={(e) => setUploadType(e.target.value as 'xml' | 'sheet')}>
            <option value="xml">Upload XML</option>
            <option value="sheet">Google Sheet Link</option>
          </select>

          {uploadType === 'sheet' ? (
            <>
              <input type="text" placeholder="Paste Google Sheet URL" value={timetableSheetUrl} onChange={(e) => setTSheetUrl(e.target.value)} className="glass-input" />
              <button onClick={handleTimetableUploadSheet} className="gradient-button">
                <i className="fas fa-cloud-upload-alt"></i> Upload Sheet
              </button>
            </>
          ) : (
            <>
              <input type="file" accept=".xml" onChange={handleXMLUploadDummy} />
              <button onClick={startFakeUploadProgress} className="gradient-button">
                <i className="fas fa-upload"></i> Upload XML
              </button>
              {loading && (
                <div className="upload-progress">
                  <div className="progress-bar" style={{ width: `${progress}%` }}>{progress}%</div>
                  <p>Uploading...</p>
                </div>
              )}
            </>
          )}

          {previewData.length > 0 && (
            <div className="preview-section">
              <h4>Preview Data</h4>
              <table>
                <thead><tr><th>Row</th><th>Data</th><th>Status</th></tr></thead>
                <tbody>
                  {previewData.map((item, idx) => (
                    <tr key={idx}><td>{item.row}</td><td>{item.data}</td><td>{item.status}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {timetableUploadMessage && <div className="status-message">{timetableUploadMessage}</div>}
      </section>

      {/* Student Upload */}
      <section className="upload-section glass-card">
        <h2 className="section-title"><i className="fas fa-users"></i> Upload Student Data</h2>
        <div className="upload-controls">
          <input type="text" placeholder="Paste Google Sheet URL" value={studentSheetUrl} onChange={(e) => setSSheetUrl(e.target.value)} className="glass-input" />
          <button onClick={handleStudentUploadSheet} className="gradient-button">
            <i className="fas fa-cloud-upload-alt"></i> Upload
          </button>
        </div>
        {studentUploadMessage && <div className="status-message">{studentUploadMessage}</div>}
      </section>

      {/* Faculty Upload */}
      <section className="upload-section glass-card">
        <h2 className="section-title"><i className="fas fa-table"></i> Upload Faculty Map</h2>
        <div className="upload-controls">
          <input type="text" placeholder="Paste Google Sheet URL" value={facultySheetUrl} onChange={(e) => setFSheetUrl(e.target.value)} className="glass-input" />
          <button onClick={handleFacultyUploadSheet} className="gradient-button">
            <i className="fas fa-cloud-upload-alt"></i> Upload
          </button>
        </div>
        {facultyUploadMessage && <div className="status-message">{facultyUploadMessage}</div>}
      </section>

      {/* Classroom List */}
      <div className="classroom-list">
        <h2>All Classrooms</h2>
        <ul>
          {classrooms.map((c) => (
            <li key={c.id} className="classroom-card">
              <p><strong>{c.name}</strong></p>
              <p>Status: <span style={{ color: c.is_active ? 'green' : 'red' }}>{c.is_active ? 'Active' : 'Inactive'}</span></p>
              <p>Radius: {c.radius}m</p>
              {c.latitude && c.longitude && <p>Location: {c.latitude.toFixed(5)}, {c.longitude.toFixed(5)}</p>}
              {c.is_active ? (
                <button onClick={() => stopAttendance(c)} className="stop-btn">Stop Attendance</button>
              ) : (
                <button onClick={() => startAttendance(c)} className="start-btn">Start Attendance</button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Classroom Grid */}
      <section className="glass-card">
        <h2 className="section-title"><i className="fas fa-chalkboard"></i> Classrooms</h2>
        <div className="grid-layout">
          {classrooms.map(c => (
            <div key={c.id} className={`grid-item ${selectedClassroomId === c.id ? 'active-item' : ''}`} onClick={() => setSelectedClassroomId(c.id)}>
              <div className="item-content">
                <i className="fas fa-door-open"></i> {c.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Attendance Records */}
      {selectedClassroomId !== null && (
        <section className="glass-card">
          <h2 className="section-title"><i className="fas fa-clipboard-check"></i> Attendance Records</h2>
          {attendance.length === 0 ? (
            <div className="empty-state"><i className="fas fa-search-minus"></i> No records found</div>
          ) : (
            <div className="data-table">
              <div className="table-header">
                <span>Student</span>
                <span>Time</span>
                <span>Location</span>
              </div>
              {attendance.map(a => (
                <div key={a.id} className="table-row">
                  <span className="user-cell"><i className="fas fa-user-graduate"></i> {a.email}</span>
                  <span className="time-cell">{new Date(a.timestamp).toLocaleString()}</span>
                  <span className="location-cell"><i className="fas fa-map-pin"></i> {a.latitude}, {a.longitude}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
