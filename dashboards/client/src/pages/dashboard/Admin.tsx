// src/pages/Admin.tsx
import React, { useState, useEffect } from 'react';
import TimeTableUpload from '../../components/TimeTableUpload';
import '../../styles/AdminDashboard.css';

export default function Admin() {
  const [institutes, setInstitutes] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);

  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    // Replace with actual API calls
    setInstitutes(['Institute A', 'Institute B']);
    setDepartments(['CSE', 'ECE']);
    setYears(['2022-23', '2023-24']);
    setSemesters(['Sem 1', 'Sem 2']);
  }, []);

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">Super Admin</h2>
        <nav>
          <ul>
            <li className="active">Upload Timetable</li>
            <li>Manage Students</li>
            <li>Faculty Data</li>
            <li>Backup/Restore</li>
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <header className="dashboard-header">
          <h1>Upload Timetable</h1>
        </header>

        <div className="upload-form">
          <div className="form-row">
            <select value={selectedInstitute} onChange={(e) => setSelectedInstitute(e.target.value)}>
              <option value="">Select Institute</option>
              {institutes.map((inst) => <option key={inst}>{inst}</option>)}
            </select>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="">Select Department</option>
              {departments.map((dept) => <option key={dept}>{dept}</option>)}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="">Select Academic Year</option>
              {years.map((yr) => <option key={yr}>{yr}</option>)}
            </select>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
              <option value="">Select Semester</option>
              {semesters.map((sem) => <option key={sem}>{sem}</option>)}
            </select>
          </div>

          <TimeTableUpload
            institute={selectedInstitute}
            department={selectedDepartment}
            year={selectedYear}
            semester={selectedSemester}
          />
        </div>
      </div>
    </div>
  );
}