import { useEffect, useState } from 'react';
import api from '../../api';

export default function TimetableViewer() {
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [timetable, setTimetable] = useState<any[]>([]);

  const selectedDayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
  const fetchTimetable = async () => {
    try {
      const user_id = localStorage.getItem('userInfo');
      const res = await api.get('/faculty/timetable', {
        params: { user_id, selectedDate }
      });
      setTimetable(res.data || []);
    } catch (err) {
      console.error('Error fetching timetable:', err);
      setTimetable([]);
    }
  };

  fetchTimetable();
}, [selectedDate]); // 👈 triggers on date change


  const todayTimetable = timetable.filter(e => e.day === selectedDayName);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
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
    verticalAlign: 'top',
    backgroundColor: 'white',
    color: 'black',
  };

  const headerStyle = {
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: "black"
  };

  const attendedStyle = {
    backgroundColor: '#d4edda',
    color: '#155724',
    fontWeight: '500',
  };
  const weeklyStyle = {
    backgroundColor: 'black',
    color: 'white',
  };

  const notAttendedStyle = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    fontWeight: '500',
  };

  const renderCellContent = (entry: any) => (
    <div style={{ textAlign: 'left', fontSize: '0.95rem' }}>
      <div><strong>Subject:</strong> {entry.subject_short || entry.name}</div>
      <div><strong>Batch:</strong> {entry.class || 'N/A'}</div>
      <div><strong>Group:</strong> {entry.group || 'N/A'}</div>
      <div><strong>Classroom:</strong> {entry.classroom || 'N/A'}</div> {/* ✅ ADDED */}
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
            <th style={{ ...thTdStyle }}>Details</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>Time</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {todayTimetable.length > 0 ? todayTimetable.map((entry, i) => (
            <tr key={`${entry.startTime}-${entry.endTime}-${i}`}>
              <td style={{...thTdStyle, ...(entry.attended ? attendedStyle : notAttendedStyle)}}>{renderCellContent(entry)}</td>
              <td style={{...thTdStyle, ...(entry.attended ? attendedStyle : notAttendedStyle)}}>{entry.startTime} - {entry.endTime}</td>
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
                    <td key={`${slot}-${day}`} style={{ 
                      ...thTdStyle, 
                      ...(match?.attended ? attendedStyle : notAttendedStyle) 
                    }}>
                      {match ? renderCellContent(match) : ''}
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
