import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/SuperAdminDashboard.module.css';
import ClassroomManagement from '../../components/StudentComponents/classroomManagement';
import LogoutButton from '../../components/LogoutButton';
import StudentProfile from '../../components/StudentComponents/ViewProfile'
import TimetableViewer from '../../components/StudentComponents/timetableViewer';


const SuperadminDashboard = () => {
  const [activeSection, setActiveSection] = useState('classroom');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const renderContent = () => {
    switch (activeSection) {
      case 'classroom':
        return <ClassroomManagement />;
        case 'timetable':
          return <TimetableViewer />;
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
        <div className={styles.logo}>Student</div>
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
