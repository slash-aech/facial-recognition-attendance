import { useState } from 'react';
import {
  uploadTimetable,
  uploadStudentData,
} from '../../api';
import StudentXMLPopup from './StudentXMLPopup';
import styles from '../../styles/SuperAdminDashboard.module.css';

const StudentTimetableUpload = () => {
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  // const [selectedStudent, setSelectedStudent] = useState('');
  // const [selectedAcademicYear, setSelectedAcademicYear] = useState('');

  // const [StudentList, setStudentList] = useState<any[]>([]);
  // const [semesterList, setSemesterList] = useState<Semester[]>([]);

  const [showPopup, setShowPopup] = useState(false);

  // Hardcoded institute ID and department ID
  const defaultInstituteId = '1';
  const defaultDepartmentId = '1';


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
          departmentId: defaultDepartmentId,
          semesterId: 'selectedSemester',
          academicCalendarId: 'selectedAcademicYear',
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

      try {
        const res = await uploadStudentData({
          spreadsheet_id: sheetId,
          sheet_name: 'Sheet1',
          institute_id: defaultInstituteId,
          dept_id: defaultDepartmentId,
          academic_calendar_id: 'selectedAcademicYear',
          Student_id: 'selectedStudent',
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
