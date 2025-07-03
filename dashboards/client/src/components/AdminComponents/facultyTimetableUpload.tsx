// FacultyTimetableUpload.tsx
import { useEffect, useState } from 'react';
import {
  fetchDepartmentsByInstitute,
  getSemestersBySemesterYear,
} from '../../api';
import XMLPopup from './FacultyXMLPopup';
import type { AcademicYear, Semester } from '../../types';
import styles from '../../styles/SuperAdminDashboard.module.css';

// Dummy data for preview table
const dummyFacultyData = [
  { id: 1, name: 'Dr. John Doe', subject: 'Mathematics', email: 'john.doe@example.com' },
  { id: 2, name: 'Dr. Jane Smith', subject: 'Physics', email: 'jane.smith@example.com' },
  { id: 3, name: 'Dr. Alice Brown', subject: 'Chemistry', email: 'alice.brown@example.com' },
];

export default function FacultyTimetableUpload() {
  // Upload settings
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [newFaculty, setNewFaculty] = useState({ name: '', subject: '', email: '' });

  // Selections
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // Data
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [semesterList, setSemesterList] = useState<Semester[]>([]);
  const [showPopup, setShowPopup] = useState(false);


  // Fetch departments on mount (assuming one institute context)
  useEffect(() => {
    fetchDepartmentsByInstitute('1')
      .then(setDepartmentList)
      .catch(console.error);
  }, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowPopup(true);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setShowPreview(false);
    setUploadMessage('');
    setTimeout(() => {
      setIsLoading(false);
      setShowPreview(true);
      setUploadMessage('Upload successful! (dummy)');
    }, 2000);
  };

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    dummyFacultyData.push({
      id: dummyFacultyData.length + 1,
      name: newFaculty.name,
      subject: newFaculty.subject,
      email: newFaculty.email,
    });
    setNewFaculty({ name: '', subject: '', email: '' });
    setShowAddFaculty(false);
    setShowPreview(true);
  };

  return (
    <div className={styles.sectionWrapper}>
      <h1>Faculty Timetable Management</h1>

      <div className={styles.headerRow}>
        <select
          value={selectedDepartment}
          onChange={e => setSelectedDepartment(e.target.value)}>
          <option value="">Department</option>
          {departmentList.map(dep => (
            <option key={dep.id} value={dep.id}>{dep.name}</option>
          ))}
        </select>

        {uploadMode === 'google' && (
          <select
            value={selectedFaculty}
            disabled={!selectedDepartment}
            onChange={e => setSelectedFaculty(e.target.value)}>
            <option value="">Select Faculty</option>
            {facultyList.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        )}

        <select value={selectedAcademicYear} onChange={e => setSelectedAcademicYear(e.target.value)}>
          <option value="">Academic Year</option>
          {academicYears.map(y => (
            <option key={y.id} value={y.id}>{`${y.start_year}-${y.end_year}`}</option>
          ))}
        </select>

        <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
          <option value="">Semester</option>
          {semesterList.map(s => (
            <option key={s.id} value={s.id}>{`Sem ${s.semester_number}`}</option>
          ))}
        </select>
      </div>

      <h2 className={styles.sectionTitle}>Timetable Upload</h2>
      <div className={styles.uploadModeSwitch}>
        <button onClick={() => setUploadMode('xml')} className={uploadMode==='xml'?styles.activeTab:''}>XML Upload</button>
        <button onClick={() => setUploadMode('google')} className={uploadMode==='google'?styles.activeTab:''}>Google Sheets</button>
      </div>

      <div className={styles.uploadBox}>
        {uploadMode === 'xml' ? (
          <div className={styles.uploadDropzone}>
            <label htmlFor="fileInput" className={styles.dropZone}>
              Click or Drop XML file
              <input id="fileInput" type="file" accept=".xml" onChange={handleFileChange} className={styles.hiddenInput} />
            </label>
            {selectedFile && showPopup && <XMLPopup file={selectedFile} onClose={() => setShowPopup(false)} />}
            <button onClick={handleUpload} className={styles.uploadBtn}>Upload XML</button>
          </div>
        ) : (
          <div className={styles.uploadDropzone}>
            <input
              type="text"
              placeholder="Google Sheet URL"
              value={googleSheetUrl}
              onChange={e => setGoogleSheetUrl(e.target.value)}
            />
            <button onClick={handleUpload} className={styles.uploadBtn}>Submit URL</button>
            {uploadMessage && <p>{uploadMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

