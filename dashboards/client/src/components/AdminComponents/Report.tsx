// Import necessary hooks and styles
import { useState } from 'react';
import '../../styles/SuperAdminDashboard.module.css';

export default function TeacherReportDownload() {
  // State to hold selected date range
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Dummy report URL to simulate generation
  const [reportUrl, setReportUrl] = useState<string>('');

  // Message to show user status
  const [message, setMessage] = useState('');

  // States for dropdown selections
  const [selectedInstitute] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemesterType, setSelectedSemesterType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');

  // Dummy data for dropdowns - to be replaced by actual API fetch
  // const institutes = ['Institute A', 'Institute B'];
  const academicYears = ['2023-2024', '2024-2025'];
  const departments = ['CSE', 'ECE', 'MECH'];
  const semesterTypes = ['Odd', 'Even'];
  const classrooms = ['Classroom 101', 'Classroom 202'];

  // Simulate report generation logic
  const generateReport = () => {
    // Validation: check if all fields are selected
    if (!dateRange.start || !dateRange.end || !selectedInstitute || !selectedAcademicYear || !selectedSemesterType || !selectedClassroom || !selectedDepartment) {
      setMessage('Please fill in all fields including dates and selections');
      return;
    }

    // Generate a dummy report URL with query params
    const report = `https://example.com/report?institute=${selectedInstitute}&year=${selectedAcademicYear}&semester=${selectedSemesterType}&department=${selectedDepartment}&classroom=${selectedClassroom}&start=${dateRange.start}&end=${dateRange.end}`;
    setReportUrl(report);
    setMessage('Report ready to download');
  };

  return (
    <div className="dashboard">
      <div className="mainContent">
        {/* Page Header */}
        <header className="dashboard-header">
          <h1 className="gradient-title">
            <span className="title-highlight">Download</span> Attendance Reports
          </h1>
        </header>

        {/* Message shown to user */}
        {message && <div className="notification-bubble">{message}</div>}

        <div className="uploadSection">
          <h2>Download Attendance Report</h2>

          {/* Dropdown Selections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          
            {/* Academic Year Dropdown */}
            <select value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)}>
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>

            {/* Semester Type Dropdown */}
            <select value={selectedSemesterType} onChange={(e) => setSelectedSemesterType(e.target.value)}>
              <option value="">Select Semester Type</option>
              {semesterTypes.map((sem) => <option key={sem} value={sem}>{sem}</option>)}
            </select>

            {/* Department Dropdown */}
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="">Select Department</option>
              {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
            </select>

            {/* Classroom Dropdown */}
            <select value={selectedClassroom} onChange={(e) => setSelectedClassroom(e.target.value)}>
              <option value="">Select Classroom</option>
              {classrooms.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Date Range Inputs */}
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

            {/* Button to generate report */}
            <button className="uploadBtn" onClick={generateReport}>Generate Report</button>
          </div>

          {/* Show download button if report is generated */}
          {reportUrl && (
            <a href={reportUrl} target="_blank" rel="noopener noreferrer" download>
              <button className="startBtn">Download Report</button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
