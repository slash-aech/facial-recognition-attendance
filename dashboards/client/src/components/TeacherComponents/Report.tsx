import { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/SuperAdminDashboard.module.css';

export default function TeacherReportDownload() {
  interface ClassEntry {
    class_id: string;
    class_name: string;
    subject_name: string;
    subject_id: string;
  }

  interface ClassroomEntry {
    classroom_id: string;
    classroom_name: string;
    subject: string;
    start_time: string;
    end_time: string;
    period: number;
    active: boolean;
    subject_name: string;
    subject_id: string;
    batch_name: string;
    attendance_taken: boolean;
    excused_students: { id: string; name: string }[];
  }


  const [todaysClasses, setTodaysClasses] = useState<ClassroomEntry[]>([]);
  const userId = localStorage.getItem('userInfo');

  // Top state
  const [manualInputs, setManualInputs] = useState<{ [key: string]: string }>({});
  const [statusMessages, setStatusMessages] = useState<{ [key: string]: string }>({});
  const [assignedClasses, setAssignedClasses] = useState<ClassEntry[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [message, setMessage] = useState('');

  const fetchAssignedClasses = async () => {
    try {
      const res = await api.patch('/report/faculty/classes', { teacher_id: userId });
      setAssignedClasses(res.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch assigned classes:', err);
      setMessage('Error loading assigned classes');
    }
  };

  const generateReport = async () => {
    if (!dateRange.start || !dateRange.end) {
      setMessage('Please provide both start and end dates');
      return;
    }

    try {
      const payload = {
        teacher_id: userId,
        start_date: dateRange.start,
        end_date: dateRange.end,
        class_name: selectedClassId !== 'all' ? selectedClassId : null
      };

      const res = await api.patch('/report/faculty/generate', payload, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('Report downloaded successfully');
    } catch (err: any) {
      console.error('❌ Failed to download report:', err);

      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          setMessage(json.error || json.message || 'Unknown error');
        } catch {
          setMessage('Unexpected error: response is not valid JSON');
        }
      } else {
        setMessage(err.response?.data?.error || 'Failed to download report');
      }
    }
  };
  const fetchTodayTimetable = async () => {
    try {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const res = await api.get(`/faculty-attendance/faculty/active-today?user_id=${userId}&day=${today}`);
      const rawData = res.data || [];
      console.log(`📅 Fetched today's timetable for user: ${userId}, day: ${today}`);

      rawData.sort((a: ClassroomEntry, b: ClassroomEntry) => {
        if (a.classroom_id === b.classroom_id && a.subject === b.subject) {
          return a.start_time.localeCompare(b.start_time);
        }
        return 0;
      });

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

      setTodaysClasses(collapsed);
      setMessage('');
    } catch (err) {
      setMessage('Failed to load today\'s classes');
    }
  };

  useEffect(() => {
    fetchTodayTimetable();
  }, []);
   const handleManualAdd = async (classroom_id: string, period: number) => {
  const key = `${classroom_id}-${period}`;
  const studentId = manualInputs[key];

  if (!studentId) {
    setStatusMessages(prev => ({ ...prev, [key]: 'Please enter a student ID' }));
    return;
  }

  try {
    const res = await api.post(`/classrooms/manual/${userId}`, {
      classroom_id,
      student_id: studentId,
      period,
    });

    if (res.status >= 200 && res.status < 300) {
      setStatusMessages(prev => ({ ...prev, [key]: 'Student marked as excused' }));
      setManualInputs(prev => ({ ...prev, [key]: '' }));
      fetchTodayTimetable(); // Refresh class data
    } else {
      setStatusMessages(prev => ({ ...prev, [key]: 'Failed to mark attendance' }));
    }
  } catch (err: any) {
    console.error(err);
    const errMsg = err.response?.data?.error || 'Error marking attendance';
    setStatusMessages(prev => ({ ...prev, [key]: errMsg }));
  }
};


  useEffect(() => {
    fetchAssignedClasses();
  }, []);

  return (
    <div className="dashboard">
      <div className="mainContent">
<div className="uploadSection">
  <h2>Manually Excuse Students</h2>
  {todaysClasses.length === 0 ? (
    <p>No classes today.</p>
  ) : (
    todaysClasses.map((cls) => {
      const key = `${cls.classroom_id}-${cls.period}`;
      return (
        <div key={key} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h3>{cls.subject_name} - {cls.classroom_name} - {cls.batch_name}</h3>
          <p>Time: {cls.start_time} - {cls.end_time}</p>
          <p>Status: {cls.active ? 'Active' : 'Not Active'}</p>

          {cls.excused_students?.length > 0 && (
            <p>Excused: {cls.excused_students.map(s => s.name || s.id).join(', ')}</p>
          )}

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Enter Student ID"
              value={manualInputs[key] || ''}
              onChange={(e) =>
                setManualInputs(prev => ({ ...prev, [key]: e.target.value }))
              }
            />
            <button onClick={() => handleManualAdd(cls.classroom_id, cls.period)}>
              Add Excused Attendance
            </button>
          </div>

          {statusMessages[key] && <p>{statusMessages[key]}</p>}
        </div>
      );
    })
  )}
</div>


        <header className="dashboard-header">
          <h1 className="gradient-title">
            <span className="title-highlight">Download</span> Attendance Reports
          </h1>
        </header>

        {message && <div className="notification-bubble">{message}</div>}

        <div className="uploadSection">
          <h2>Generate Report</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
              <option value="">Select Class (Optional)</option>
              <option value="all">All My Classes</option>
              {assignedClasses.map((cls) => (
                <option key={cls.class_id} value={cls.class_name}>
                  {cls.class_name} - {cls.subject_name}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>

            <button className="uploadBtn" onClick={generateReport}>
              Generate PDF Report
            </button>
          </div>
        </div>

        
      </div>
    </div>
  );
}
