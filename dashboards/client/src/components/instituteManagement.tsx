import { useState } from 'react';
import styles from '../styles/SuperAdminDashboard.module.css';

interface Institute {
  id: number;
  name: string;
  departments: string[];
  academicCalendar: {
    start: string;
    end: string;
  };
}

const InstituteManagement = () => {
  const [institutes, setInstitutes] = useState<Institute[]>([{
    id: 1,
    name: 'Institute A',
    departments: ['CSE', 'ECE'],
    academicCalendar: { start: '2024-06-01', end: '2025-05-31' }
  }]);

  const [newInstitute, setNewInstitute] = useState('');
  const [selectedInstituteId, setSelectedInstituteId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [semType, setSemType] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const displayedSemesters = semType === 'odd'
    ? ['1st', '3rd', '5th', '7th']
    : semType === 'even'
    ? ['2nd', '4th', '6th', '8th']
    : [];

  const addInstitute = () => {
    if (!newInstitute.trim()) return;
    const newId = institutes.length + 1;
    setInstitutes([...institutes, {
      id: newId,
      name: newInstitute.trim(),
      departments: [],
      academicCalendar: { start: '', end: '' }
    }]);
    setNewInstitute('');
  };

  const deleteInstitute = (id: number) => {
    setInstitutes(institutes.filter(i => i.id !== id));
    if (selectedInstituteId === id) setSelectedInstituteId(null);
  };

  const updateCalendarDates = () => {
    if (selectedInstituteId === null) return;
    setInstitutes(prev => prev.map(inst =>
      inst.id === selectedInstituteId
        ? { ...inst, academicCalendar: { start: startDate, end: endDate } }
        : inst
    ));
  };

  const selectedInstituteData = institutes.find(i => i.id === selectedInstituteId);

  return (
    <div className={styles.sectionWrapper}>
      <h2 className={styles.sectionTitle}>Institute Management</h2>

      <div className={styles.uploadBox}>
        <input
          type="text"
          placeholder="New Institute Name"
          value={newInstitute}
          onChange={(e) => setNewInstitute(e.target.value)}
        />
        <button onClick={addInstitute} className={styles.uploadBtn}>Add Institute</button>
      </div>

      <div className={styles.uploadBox}>
        <h3>Institutes List</h3>
        <ul>
          {institutes.map(inst => (
            <li key={inst.id} className={styles.gridItem}>
              <strong>{inst.name}</strong>
              <div style={{ marginTop: '8px' }}>
                <button onClick={() => setSelectedInstituteId(inst.id)} className={styles.startBtn}>Select</button>
                <button onClick={() => deleteInstitute(inst.id)} className={styles.stopBtn}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedInstituteData && (
        <>
          <div className={styles.uploadBox}>
            <h3>Options for: {selectedInstituteData.name}</h3>
            <div className={styles.dateRangeWrapper}>
              <h4>Update Academic Calendar</h4>
              <label>Start Date:
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </label>
              <label>End Date:
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </label>
              <button onClick={updateCalendarDates} className={styles.uploadBtn}>Update Calendar</button>
            </div>
          </div>

          <div className={styles.uploadBox}>
            <h4>Select Department</h4>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="">Select Department</option>
              {selectedInstituteData.departments.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {selectedDepartment && !semType && (
            <div className={styles.uploadBox}>
              <h4>Department Options</h4>
              <button className={styles.uploadBtn}>Update Faculty Timetable</button>
              <button className={styles.uploadBtn} onClick={() => setSemType('odd')}>Go to Student Timetable</button>
            </div>
          )}

          {selectedDepartment && semType && (
            <div className={styles.uploadBox}>
              <h4>Semester Type</h4>
              <select value={semType} onChange={(e) => { setSemType(e.target.value); setSelectedSemester(''); }}>
                <option value="">Select Type</option>
                <option value="odd">Odd Semester</option>
                <option value="even">Even Semester</option>
              </select>

              <h4>Select Semester</h4>
              <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} disabled={!semType}>
                <option value="">Select Semester</option>
                {displayedSemesters.map((sem, idx) => (
                  <option key={idx} value={sem}>{sem}</option>
                ))}
              </select>

              {selectedSemester && (
                <div style={{ marginTop: '20px' }}>
                  <p>Student timetable data display and actions here.</p>
                  <button className={styles.uploadBtn}>Replace Student Timetable</button>
                  <button className={styles.stopBtn}>Delete Student Timetable</button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstituteManagement;