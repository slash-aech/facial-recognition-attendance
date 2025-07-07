import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/SuperAdminDashboard.module.css';

import FacultyTimetableUpload from '../../components/SuperAdminComponents/facultyTimetableUpload';
import StudentTimetableUpload from '../../components/SuperAdminComponents/studentTimetableUpload';
import AttendanceTeacher from '../../components/SuperAdminComponents/AttendanceTeacher';
import LogoutButton from '../../components/SuperAdminComponents/LogoutButton';
import TeacherReport from '../../components/SuperAdminComponents/Report'
import StudentProfile from '../../components/SuperAdminComponents/ViewProfile'
import TimetableViewer from '../../components/SuperAdminComponents/timetableViewer';
import InstituteManagement from '../../components/SuperAdminComponents/InstituteManagement';


const SuperadminDashboard = () => {
  const [activeSection, setActiveSection] = useState('faculty');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const renderContent = () => {
    switch (activeSection) {
      
      case 'faculty':
        return <FacultyTimetableUpload />;
      case 'student':
        return <StudentTimetableUpload />;
      case 'classroom':
        return <AttendanceTeacher />;
        case 'timetable':
          return <TimetableViewer />;
      case 'report':
        return <TeacherReport />;
      case 'institute':
        return <InstituteManagement />;
        case 'profile':
        return <StudentProfile />;
      default:
        return null;
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // When switching section, auto-close menu
  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  return (
    <div className={styles.dashboardWrapper}>
      {/* Overlay for background blur when menu is open */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.logo}>Super Admin</div>
        <nav>
          <ul>
            <li
              className={activeSection === 'faculty' ? styles.active : ''}
              onClick={() => handleSectionClick('faculty')}
            >
              Faculty Management
            </li>
            <li
              className={activeSection === 'student' ? styles.active : ''}
              onClick={() => handleSectionClick('student')}
            >
              Student Management
            </li>
            <li
              className={activeSection === 'classroom' ? styles.active : ''}
              onClick={() => handleSectionClick('classroom')}
            >
              Classroom Management
            </li>
            <li
              className={activeSection === 'timetable' ? styles.active : ''}
              onClick={() => handleSectionClick('timetable')}
            >
              View Timetable
            </li>
            <li
              className={activeSection === 'report' ? styles.active : ''}
              onClick={() => handleSectionClick('report')}
            >
              Download Attendance Report
            </li>
            {/* <li
              className={activeSection === 'institute' ? styles.active : ''}
              onClick={() => handleSectionClick('institute')}
            >
              Institute Management
            </li> */}
            <li
              className={activeSection === 'profile' ? styles.active : ''}
              onClick={() => handleSectionClick('profile')}
            >
              View Your Profile
            </li>
          </ul>
          <LogoutButton />
        </nav>
      </aside>

    <main className={styles.mainContent}>
  <button className={styles.hamburger} onClick={() => setSidebarOpen(!sidebarOpen)}>
    ☰
  </button>
  <div className={styles.contentWrapper}>
    {renderContent()}
  </div>
</main>
    </div>
  );
};

export default SuperadminDashboard;
