import { useEffect, useState } from 'react';
import {
  fetchAllInstitutes,
  fetchDepartmentsByInstitute,
  fetchFacultyByDepartment,
  fetchAcademicYears,
  getSemestersBySemesterYear,
  uploadTimetable,
  uploadFacultyData,
} from '../../api';
import XMLPopup from './FacultyXMLPopup';
import type { AcademicYear, Semester } from '../../api';
import styles from '../../styles/SuperAdminDashboard.module.css';

// Dummy data for preview table after upload
const dummyFacultyData = [
  { id: 1, name: 'Dr. John Doe', subject: 'Mathematics', email: 'john.doe@example.com' },
  { id: 2, name: 'Dr. Jane Smith', subject: 'Physics', email: 'jane.smith@example.com' },
  { id: 3, name: 'Dr. Alice Brown', subject: 'Chemistry', email: 'alice.brown@example.com' },
];

const FacultyTimetableUpload = () => {
  // State for upload mode (xml or google sheet)
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  // State for selected file (xml)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // State for Google Sheet URL
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  // State for upload message
  const [uploadMessage, setUploadMessage] = useState('');
  // State for loading bar
  const [isLoading, setIsLoading] = useState(false);
  // State for showing preview table
  const [showPreview, setShowPreview] = useState(false);
  // State for showing add faculty modal/section
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  // Dummy state for new faculty form
  const [newFaculty, setNewFaculty] = useState({ name: '', subject: '', email: '' });

  // Selection states
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // Data lists
  const [instituteList, setInstituteList] = useState<any[]>([]);
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [semesterList, setSemesterList] = useState<Semester[]>([]);

  // Popup for XML preview
  const [showPopup, setShowPopup] = useState(false);

  // Fetch all institutes and academic years on mount
  useEffect(() => {
    fetchAllInstitutes().then(setInstituteList).catch(console.error);
    fetchAcademicYears().then(setAcademicYears).catch(console.error);
  }, []);

  // Fetch departments when institute changes
  useEffect(() => {
    if (selectedInstitute) {
      fetchDepartmentsByInstitute(selectedInstitute)
        .then(setDepartmentList)
        .catch(console.error);
    } else {
      setDepartmentList([]);
    }
    setSelectedDepartment('');
    setSelectedFaculty('');
  }, [selectedInstitute]);

  // Fetch faculty when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchFacultyByDepartment(selectedInstitute, selectedDepartment)
        .then(setFacultyList)
        .catch(console.error);
    } else {
      setFacultyList([]);
    }
    setSelectedFaculty('');
  }, [selectedDepartment]);

  // Fetch semesters when academic year changes
  useEffect(() => {
    if (selectedAcademicYear) {
      getSemestersBySemesterYear(selectedAcademicYear)
        .then(setSemesterList)
        .catch(console.error);
    } else {
      setSemesterList([]);
    }
  }, [selectedAcademicYear]);

  // Handle file input change for XML upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowPopup(true);
    }
  };

  // Handle upload for both XML and Google Sheet
  const handleUpload = async () => {
    setIsLoading(true); // Show loading bar
    setShowPreview(false); // Hide preview until upload completes
    setUploadMessage('');
    setTimeout(() => { // Simulate upload delay
      setIsLoading(false);
      setShowPreview(true); // Show preview table after upload
      setUploadMessage('Upload successful! (dummy)');
    }, 2000);
    // ...existing code for actual upload can be placed here if needed...
  };

  // Handle dummy add faculty (just adds to dummyFacultyData for now)
  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, send to backend. Here, just show preview with new data.
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

      {/* Selection Row */}
      <div className={styles.headerRow}>
        <select value={selectedInstitute} onChange={e => setSelectedInstitute(e.target.value)}>
          <option value="">Institute</option>
          {instituteList.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
        </select>

        <select
          value={selectedDepartment}
          disabled={!selectedInstitute}
          onChange={e => setSelectedDepartment(e.target.value)}>
          <option value="">Department</option>
          {departmentList.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
        </select>

        {/* Only show faculty dropdown in Google Sheets mode */}
        {uploadMode === 'google' && (
          <select
            value={selectedFaculty}
            disabled={!selectedDepartment}
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
