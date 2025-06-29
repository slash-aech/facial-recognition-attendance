import { useState } from 'react';

const dummyTimetable = [
  { id: 1, name: 'Math', startTime: '09:00', endTime: '10:00', attended: true, day: 'Monday' },
  { id: 2, name: 'Physics', startTime: '10:00', endTime: '11:00', attended: false, day: 'Monday' },
  { id: 3, name: 'Chemistry', startTime: '09:00', endTime: '10:00', attended: true, day: 'Tuesday' },
  { id: 4, name: 'Biology', startTime: '11:00', endTime: '12:00', attended: false, day: 'Wednesday' },
  { id: 5, name: 'English', startTime: '10:00', endTime: '11:00', attended: true, day: 'Thursday' },
  { id: 6, name: 'CS', startTime: '11:00', endTime: '12:00', attended: false, day: 'Friday' },
];

export default function TimetableViewer() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const selectedDayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });

  const todayBase = dummyTimetable.filter(e => e.day === selectedDayName);
  const todayTimetable = todayBase.flatMap((entry) => [
    { ...entry, id: entry.id + 'a', name: `${entry.name} - Lecture` },
    { ...entry, id: entry.id + 'b', name: `${entry.name} - Lab` },
    { ...entry, id: entry.id + 'c', name: `${entry.name} - Tutorial` },
  ]);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from(new Set(dummyTimetable.map(e => `${e.startTime} - ${e.endTime}`))).sort();

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '1rem',
  };

  const thTdStyle = {
    border: '1px solid #ccc',
    padding: '0.6rem',
    textAlign: "center" as const,
  };

  const headerStyle = {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    color:"black"
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
            <th style={{ ...thTdStyle, ...headerStyle }}>Subject</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>Time</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {todayTimetable.length > 0 ? todayTimetable.map((entry) => (
            <tr key={entry.id}>
              <td style={thTdStyle}>{entry.name}</td>
              <td style={thTdStyle}>{entry.startTime} - {entry.endTime}</td>
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
                  const match = dummyTimetable.find(
                    e => `${e.startTime} - ${e.endTime}` === slot && e.day === day
                  );
                  return (
                    <td key={`${slot}-${day}`} style={{ ...thTdStyle, ...(match?.attended ? attendedStyle : notAttendedStyle) }}>
                      {match ? match.name : ''}
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
