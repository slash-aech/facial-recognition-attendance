import React, { useState, useEffect } from 'react';
import TimeTableUpload from '../../components/TimeTableUpload';
import '../../styles/AdminDashboard.css';

import {
  fetchAllInstitutes,
  fetchDepartmentsByInstitute,
  fetchAcademicYears,
  fetchSemesters
} from '../../api';

// Types
interface Institute {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
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
  semester_type: string;
  academic_year_id: string;
  institute_id: string;
}

export default function Admin() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // Fetch all data on mount
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

  // Fetch departments when institute changes
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
            {/* Select Institute */}
            <select
              value={selectedInstitute}
              onChange={(e) => setSelectedInstitute(e.target.value)}
            >
              <option value="">Select Institute</option>
              {institutes.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>

            {/* Select Department */}
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

            {/* Select Academic Year */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select Academic Year</option>
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.start_year} - {year.end_year}
                </option>
              ))}
            </select>

            {/* Select Semester */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              {semesters
                .filter(
                  (sem) =>
                    sem.academic_year_id === selectedYear &&
                    sem.institute_id === selectedInstitute
                )
                .map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.semester_type}
                  </option>
                ))}
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
