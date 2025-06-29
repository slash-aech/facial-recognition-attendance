import { useEffect, useState } from 'react';
import '../../styles/SuperAdminDashboard.module.css';
import {
  fetchAllInstitutes,
  fetchDepartmentsByInstitute,
  fetchAcademicYears,
  fetchSemesters,
  fetchAcademicCalendarBySemester
} from '../../api';
import type {
  Institute,
  Department,
  AcademicYear,
  Semester,
  Classroom
} from '../../types';

export default function AttenanceTeacher() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [academicCalendarId, setAcademicCalendarId] = useState('');

  const [message, setMessage] = useState('');
  const [activeClassroomId, setActiveClassroomId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllInstitutes().then(setInstitutes);
    fetchAcademicYears().then(setAcademicYears);
  }, []);

  useEffect(() => {
    if (selectedInstitute) {
      fetchDepartmentsByInstitute(selectedInstitute).then(setDepartments);
    }
  }, [selectedInstitute]);

  useEffect(() => {
    if (selectedInstitute && selectedAcademicYear) {
      fetchSemesters({ instituteId: selectedInstitute, academicYearId: selectedAcademicYear }).then(setSemesters);
    }
  }, [selectedInstitute, selectedAcademicYear]);

  useEffect(() => {
    if (selectedSemester) {
      fetchAcademicCalendarBySemester(selectedSemester).then(data => {
        if (data?.id) setAcademicCalendarId(data.id);
      });
    }
  }, [selectedSemester]);

  const startAttendance = (classroomId: number) => {
    setActiveClassroomId(classroomId);
    setMessage(`Started attendance for classroom ID: ${classroomId}`);
    setTimeout(() => {
      if (activeClassroomId === classroomId) {
        stopAttendance(classroomId);
      }
    }, 5 * 60 * 1000); // 5 minutes
  };

  const stopAttendance = (classroomId: number) => {
    if (activeClassroomId === classroomId) {
      setActiveClassroomId(null);
      setMessage(`Stopped attendance for classroom ID: ${classroomId}`);
    }
  };

  const fetchClassrooms = async () => {
    if (!selectedInstitute || !selectedDepartment || !selectedAcademicYear || !selectedSemester || !academicCalendarId) {
      alert("Please select all dropdowns before loading classrooms.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:10000/api/classrooms?instituteId=${selectedInstitute}&departmentId=${selectedDepartment}&academicYearId=${selectedAcademicYear}&semesterId=${selectedSemester}&academicCalendarId=${academicCalendarId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setClassrooms(data);
    } catch (error) {
      console.error('Failed to fetch classrooms:', error);
      setMessage('Error fetching classrooms');
    }
  };

  return (
    <div className="mainContent">
      <header className="dashboard-header">
        <h1 className="gradient-title">
          <span className="title-highlight">Teacher</span> Dashboard
        </h1>
      </header>

      {message && <div className="notification-bubble">{message}</div>}

      <div className="uploadSection">
        <h2>Select Filters</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <select value={selectedInstitute} onChange={e => setSelectedInstitute(e.target.value)}>
            <option value="">Select Institute</option>
            {institutes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>

          <select value={selectedAcademicYear} onChange={e => setSelectedAcademicYear(e.target.value)}>
            <option value="">Select Academic Year</option>
            {academicYears.map(ay => <option key={ay.id} value={ay.id}>{ay.start_year} - {ay.end_year}</option>)}
          </select>

          <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
            <option value="">Select Semester</option>
            {semesters.map(s => <option key={s.id} value={s.id}>{s.semester_type}</option>)}
          </select>

          <button onClick={fetchClassrooms}>Load Classrooms</button>
        </div>

        <h2>Today's Classrooms</h2>
        <ul>
          {classrooms.map((classroom) => (
            <li key={classroom.id} className="classroom-card">
              <p><strong>{classroom.name}</strong></p>
              <p>Time: {'time' in classroom ? (classroom as any).time : 'N/A'}</p>
              {activeClassroomId === classroom.id ? (
                <button onClick={() => stopAttendance(classroom.id)} className="stopBtn">Stop Attendance</button>
              ) : (
                <button onClick={() => startAttendance(classroom.id)} className="startBtn">Start Attendance</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}