import { useEffect, useState } from 'react';
import api from '../../api';

export default function StudentTimetableViewer() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [timetable, setTimetable] = useState<any[]>([]);
  const selectedDayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    const fetchTimetable = async () => {
      const studentId = localStorage.getItem('userInfo');
      if (!studentId) return;

      try {
        const user_id = localStorage.getItem('userInfo');
        console.log('🔍 Fetching student timetable for user:', user_id, 'on date:', selectedDate);
        const res = await api.get('/student/timetable', {
        params: { user_id, selectedDate }
      });
        setTimetable(res.data || []);
      } catch (err) {
        console.error('Error fetching student timetable:', err);
        setTimetable([]);
      }
    };

    fetchTimetable();
  }, []);

  const todayTimetable = timetable
  .filter(e => e.day === selectedDayName)
  .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = Array.from(new Set(timetable.map(e => `${e.startTime} - ${e.endTime}`))).sort();

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '1rem',
  };

  const thTdStyle = {
    border: '1px solid #ccc',
    padding: '0.6rem',
    textAlign: "center" as const,
    verticalAlign: 'top' as const,
  };

  const headerStyle = {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    color: "black"
  };

  const attendedStyle = {
    backgroundColor: '#d4edda',
    color: '#155724',
    fontWeight: '500',
  };

  const notAttendedStyle = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    fontWeight: '500',
  };

  const renderCellDetails = (entry: any) => (
    <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
      <div><strong>Subject:</strong> {entry.subject || 'N/A'}</div>
      <div><strong>Batch:</strong> {entry.class || 'N/A'}</div>
      <div><strong>Group:</strong> {entry.group || 'N/A'}</div>
      <div><strong>Classroom:</strong> {entry.classroom || 'N/A'}</div>
    </div>
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <h2>Today's Timetable</h2>
      <input
        type="date"
        value={selectedDate}
        style={{ margin: '1rem 0', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thTdStyle, ...headerStyle }}>Details</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>Time</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {todayTimetable.length > 0 ? todayTimetable.map((entry, i) => (
            <tr key={i}>
              <td style={{ ...thTdStyle, ...(entry.attended ? attendedStyle : notAttendedStyle) }}>{renderCellDetails(entry)}</td>
              <td style={{ ...thTdStyle, ...(entry.attended ? attendedStyle : notAttendedStyle) }}>{entry.startTime} - {entry.endTime}</td>
              <td style={{ ...thTdStyle, ...(entry.attended ? attendedStyle : notAttendedStyle) }}>
                {entry.attended ? 'Attended' : 'Not Attended'}
              </td>
            </tr>
          )) : (
            <tr><td colSpan={3} style={thTdStyle}>No classes scheduled</td></tr>
          )}
        </tbody>
      </table>

      <h2 style={{ marginTop: '3rem' }}>Weekly Timetable</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thTdStyle, ...headerStyle }}>Time</th>
              {weekDays.map(day => <th key={day} style={{ ...thTdStyle, ...headerStyle }}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot}>
                <td style={thTdStyle}>{slot}</td>
                {weekDays.map(day => {
                  const match = timetable.find(
                    e => `${e.startTime} - ${e.endTime}` === slot && e.day === day
                  );
                  return (
                    <td key={`${slot}-${day}`} style={{ ...thTdStyle }}>
                      {match ? renderCellDetails(match) : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
