import React, { useState, useEffect } from 'react';
import TimeTableUpload from '../../components/TimeTableUpload';
import '../../styles/AdminDashboard.css';

import {
  fetchAllInstitutes,
  fetchDepartmentsByInstitute,
  fetchAcademicYears,
  fetchSemesters,
  fetchAcademicCalendarBySemester,
} from '../../api';

// Types
interface Institute {
  id: string;
  name: string;
  address: string;
  email: string;
}

interface Department {
  id: string;
  name: string;
  institute_id: string;
}

interface AcademicYear {
  id: string;
  start_year: number;
  end_year: number;
}

interface Semester {
  id: string;
  academic_year_id: string;
  institute_id: string;
  semester_type: string; // e.g., "Even", "Odd"
}

interface AcademicCalendar {
  id: string;
  semester_id: string;
  start_date: string;
  end_date: string;
}

export default function Admin() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [academicCalendar, setAcademicCalendar] = useState<AcademicCalendar[]>([]);

  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCalendarId, setSelectedCalendarId] = useState('');

  // Fetch initial data: Institutes, Academic Years, Semesters
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [instituteData, yearData, semesterData] = await Promise.all([
          fetchAllInstitutes(),
          fetchAcademicYears(),
          fetchSemesters(),
        ]);
        setInstitutes(instituteData);
        setYears(yearData);
        setSemesters(semesterData);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch departments based on selected institute
  useEffect(() => {
    const fetchDeps = async () => {
      if (!selectedInstitute) {
        setDepartments([]);
        return;
      }

      try {
        const data = await fetchDepartmentsByInstitute(selectedInstitute);
        setDepartments(data);
      } catch (error) {
        console.error('Failed to load departments:', error);
      }
    };

    fetchDeps();
    setSelectedDepartment('');
  }, [selectedInstitute]);

  // Fetch academic calendar when semester is selected
  useEffect(() => {
    const fetchCalendar = async () => {
      if (!selectedSemester) {
        setAcademicCalendar([]);
        return;
      }

      try {
        const data = await fetchAcademicCalendarBySemester(selectedSemester);
        setAcademicCalendar([data]); // Always wrap in array
      } catch (error) {
        console.error('Failed to load academic calendar:', error);
      }
    };

    fetchCalendar();
    setSelectedCalendarId('');
  }, [selectedSemester]);

  // Filter semesters for selected institute and year
  const filteredSemesters = semesters.filter(
    (sem) =>
      sem.institute_id === selectedInstitute && sem.academic_year_id === selectedYear
  );

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
            {/* Institute Dropdown */}
            <select
              value={selectedInstitute}
              onChange={(e) => {
                setSelectedInstitute(e.target.value);
                setSelectedYear('');
                setSelectedSemester('');
                setAcademicCalendar([]);
              }}
            >
              <option value="">Select Institute</option>
              {institutes.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>

            {/* Department Dropdown */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              disabled={!selectedInstitute}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Academic Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedSemester('');
                setAcademicCalendar([]);
              }}
              disabled={!selectedInstitute}
            >
              <option value="">Select Academic Year</option>
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.start_year} - {year.end_year}
                </option>
              ))}
            </select>

            {/* Semester Dropdown */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={!selectedInstitute || !selectedYear}
            >
              <option value="">Select Semester</option>
              {filteredSemesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.semester_type}
                </option>
              ))}
            </select>

            {/* Academic Calendar Dropdown */}
            <select
              value={selectedCalendarId}
              onChange={(e) => setSelectedCalendarId(e.target.value)}
              disabled={!academicCalendar.length}
            >
              <option value="">Select Academic Calendar</option>
              {academicCalendar.map((cal) => (
                <option key={cal.id} value={cal.id}>
                  {new Date(cal.start_date).toLocaleDateString()} -{' '}
                  {new Date(cal.end_date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Timetable Upload Component */}
          <TimeTableUpload
            institute={selectedInstitute}
            department={selectedDepartment}
            year={selectedYear}
            semester={selectedSemester}
            academicCalendarId={selectedCalendarId}
          />
        </div>
      </div>
    </div>
  );
}
