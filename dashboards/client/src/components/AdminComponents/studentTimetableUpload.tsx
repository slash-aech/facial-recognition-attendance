import { useEffect, useState } from 'react';
import {
  fetchDepartmentsByInstitute,
  fetchStudentByDepartment,
  fetchAcademicYears,
  getSemestersBySemesterYear,
  uploadTimetable,
  uploadStudentData,
} from '../../api';
import StudentXMLPopup from './StudentXMLPopup';
import type { AcademicYear, Semester } from '../../api';
import styles from '../../styles/SuperAdminDashboard.module.css';

const StudentTimetableUpload = () => {
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const [departmentList, setDepartmentList] = useState<any[]>([]);
  const [StudentList, setStudentList] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [semesterList, setSemesterList] = useState<Semester[]>([]);

  const [showPopup, setShowPopup] = useState(false);

  // Hardcoded institute ID (since we are removing selection)
  const defaultInstituteId = '1';

  // Initial load
  useEffect(() => {
    fetchDepartmentsByInstitute(defaultInstituteId).then(setDepartmentList).catch(console.error);
    fetchAcademicYears().then(setAcademicYears).catch(console.error);
  }, []);

  // Load Student list when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchStudentByDepartment(defaultInstituteId, selectedDepartment)
        .then(setStudentList)
        .catch(console.error);
    } else {
      setStudentList([]);
    }
    setSelectedStudent('');
  }, [selectedDepartment]);

  // Load semesters when academic year changes
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
    if (uploadMode === 'xml' && selectedFile) {
      try {
        const parsedData: never[] = [];
        const meta = {
          instituteId: defaultInstituteId,
          departmentId: selectedDepartment,
          semesterId: selectedSemester,
          academicCalendarId: selectedAcademicYear,
        };
        const res = await uploadTimetable(parsedData, meta);
        setUploadMessage(res?.message || 'Timetable uploaded successfully');
      } catch {
        setUploadMessage('Failed to upload timetable');
      }
    } else if (uploadMode === 'google') {
      const sheetIdMatch = googleSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      const sheetId = sheetIdMatch ? sheetIdMatch[1] : null;
      if (!sheetId) return setUploadMessage('Invalid Google Sheet URL');

      if (!selectedStudent) {
        return setUploadMessage('Please select a Student');
      }

      try {
        const res = await uploadStudentData({
          spreadsheet_id: sheetId,
          sheet_name: 'Sheet1',
          institute_id: defaultInstituteId,
          dept_id: selectedDepartment,
          academic_calendar_id: selectedAcademicYear,
          Student_id: selectedStudent,
        } as any);
        setUploadMessage(res || 'Student data uploaded');
      } catch (e: any) {
        setUploadMessage(e?.message || 'Failed to upload Student data');
      }
    }
  };

  return (
    <div className={styles.sectionWrapper}>
      <h1>Student Timetable Management</h1>

      {/* Selection Row */}
      <div className={styles.headerRow}>
        <select
          value={selectedDepartment}
          onChange={e => setSelectedDepartment(e.target.value)}>
          <option value="">Department</option>
          {departmentList.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
        </select>

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
            {selectedFile && showPopup && <StudentXMLPopup file={selectedFile} onClose={() => setShowPopup(false)} />}
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

export default StudentTimetableUpload;
