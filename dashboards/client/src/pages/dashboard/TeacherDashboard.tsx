import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/SuperAdminDashboard.module.css';

import ClassroomManagement from '../../components/TeacherComponents/classroomManagement';
import LogoutButton from '../../components/SuperAdminComponents/LogoutButton';
import TeacherReport from '../../components/HODComponents/Report'
import StudentProfile from '../../components/HODComponents/ViewProfile'
import TimetableViewer from '../../components/TeacherComponents/timetableViewer';


const SuperadminDashboard = () => {
  const [activeSection, setActiveSection] = useState('faculty');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const renderContent = () => {
    switch (activeSection) {

      case 'classroom':
        return <ClassroomManagement />;
        case 'timetable':
          return <TimetableViewer />;
      case 'report':
        return <TeacherReport />;
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
        <div className={styles.logo}>Teacher</div>
        <nav>
          <ul>
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
