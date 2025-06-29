import { useEffect, useState } from 'react';
import {
  fetchFacultyByDepartment,
  fetchAcademicYears,
  getSemestersBySemesterYear,
  uploadTimetable,
  uploadFacultyData,
} from '../../api';
import XMLPopup from './FacultyXMLPopup';
import type { AcademicYear, Semester } from '../../api';
import styles from '../../styles/SuperAdminDashboard.module.css';

const FacultyTimetableUpload = () => {
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [newFaculty, setNewFaculty] = useState({ name: '', subject: '', email: '' });

  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [semesterList, setSemesterList] = useState<Semester[]>([]);

  const [showPopup, setShowPopup] = useState(false);

  // Hardcoded institute and department IDs
  const defaultInstituteId = '1';
  const defaultDepartmentId = '1';

  useEffect(() => {
    fetchAcademicYears().then(setAcademicYears).catch(console.error);
    fetchFacultyByDepartment(defaultInstituteId, defaultDepartmentId)
      .then(setFacultyList)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedAcademicYear) {
      getSemestersBySemesterYear(selectedAcademicYear)
        .then(setSemesterList)
        .catch(console.error);
    } else {
      setSemesterList([]);
    }
  }, [selectedAcademicYear]);

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
    setNewFaculty({ name: '', subject: '', email: '' });
    setShowAddFaculty(false);
    setShowPreview(true);
  };

  return (
    <div className={styles.sectionWrapper}>
      <h1>Faculty Timetable Management</h1>

      {/* Selection Row */}
      <div className={styles.headerRow}>
        {uploadMode === 'google' && (
          <select
            value={selectedFaculty}
            onChange={e => setSelectedFaculty(e.target.value)}>
            <option value="">Select Faculty</option>
            {facultyList.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        )}

        <select value={selectedAcademicYear} onChange={e => setSelectedAcademicYear(e.target.value)}>
          <option value="">Academic Year</option>
          {academicYears.map(y => <option key={y.id} value={y.id}>{`${y.start_year}-${y.end_year}`}</option>)}
        </select>

        <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
          <option value="">Semester</option>
          {semesterList.map(s => <option key={s.id} value={s.id}>{`Sem ${s.semester_number}`}</option>)}
        </select>
      </div>

      {/* Upload Mode Toggle */}
      <h2 className={styles.sectionTitle}>Timetable Upload</h2>
      <div className={styles.uploadModeSwitch}>
        <button onClick={() => setUploadMode('xml')} className={uploadMode==='xml'?styles.activeTab:''}>XML Upload</button>
        <button onClick={() => setUploadMode('google')} className={uploadMode==='google'?styles.activeTab:''}>Google Sheets</button>
      </div>

      {/* Upload Box */}
      <div className={styles.uploadBox}>
        {uploadMode === 'xml' ? (
          <div className={styles.uploadDropzone}>
            <label htmlFor="fileInput" className={styles.dropZone}>
              Click or Drop XML file
              <input id="fileInput" type="file" accept=".xml" onChange={handleFileChange} className={styles.hiddenInput}/>
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
};

export default FacultyTimetableUpload;