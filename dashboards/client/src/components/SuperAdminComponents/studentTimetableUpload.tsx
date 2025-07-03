import { useEffect, useState } from 'react';
import {
  fetchAllInstitutes,
  fetchDepartmentsByInstitute,
  fetchStudentByDepartment,
  getSemestersBySemesterYear,
  uploadTimetable,
  uploadStudentData,
} from '../../api';
import api from '../../api';
import StudentXMLPopup from './StudentXMLPopup';
import type { Semester } from '../../api';
import styles from '../../styles/SuperAdminDashboard.module.css';

const StudentTimetableUpload = () => {
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const [instituteList, setInstituteList] = useState<any[]>([]);
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  const [StudentList, setStudentList] = useState<any[]>([]);
  const [semesterList, setSemesterList] = useState<Semester[]>([]);

  const [showPopup, setShowPopup] = useState(false);

  // Teacher upload state
  const [teacherFile, setTeacherFile] = useState<File | null>(null);
  const [teacherUploadMessage, setTeacherUploadMessage] = useState('');
  const [isTeacherUploading, setIsTeacherUploading] = useState(false);

  // Initial load
  useEffect(() => {
    fetchAllInstitutes().then(setInstituteList).catch(console.error);
  }, []);

  // Load departments when institute changes
  useEffect(() => {
    if (selectedInstitute) {
      fetchDepartmentsByInstitute(selectedInstitute)
        .then(setDepartmentList)
        .catch(console.error);
    } else {
      setDepartmentList([]);
    }
    setSelectedDepartment('');
    setSelectedStudent('');
  }, [selectedInstitute]);

  // Load Student list when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchStudentByDepartment(selectedInstitute, selectedDepartment)
        .then(res => {
          if (Array.isArray(res)) setStudentList(res);
          else setStudentList([res]);
        })
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
          instituteId: selectedInstitute,
          departmentId: selectedDepartment,
          semesterId: selectedSemester,
          academicCalendarId: selectedAcademicYear,
          // Student ignored for XML
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
          institute_id: selectedInstitute,
          dept_id: selectedDepartment,
          academic_calendar_id: selectedAcademicYear,
          // pass Student id
          Student_id: selectedStudent,
        } as any);
        setUploadMessage(res || 'Student data uploaded');
      } catch (e: any) {
        setUploadMessage(e?.message || 'Failed to upload Student data');
      }
    }
  }
  const handleTeacherFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTeacherFile(e.target.files[0]);
    }
  };

  const handleTeacherUpload = async () => {
    if (!teacherFile || !selectedInstitute || !selectedDepartment) {
      setTeacherUploadMessage('Institute must be selected before uploading.');
      return;
    }
    setIsTeacherUploading(true);
    setTeacherUploadMessage('');
    const formData = new FormData();
    formData.append('file', teacherFile);
    formData.append('instituteId', selectedInstitute);
    formData.append('deptId', selectedDepartment);

    try {
        const res = await api.post('/student-data-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      });
    const result = res.data;
      if (result.success) {
        setTeacherUploadMessage('Student Excel Upload successful!');
      } else {
        setTeacherUploadMessage(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setTeacherUploadMessage(`Upload failed: ${err.message}`);
    } finally {
      setIsTeacherUploading(false);
    }
  };

  return (
    <div className={styles.sectionWrapper}>
      <h1>Student Timetable Management</h1>

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
      <h2 className={styles.sectionTitle}>Teacher Info Upload</h2>
      <div className={styles.uploadBox}>
        <div className={styles.uploadDropzone}>
          <label htmlFor="teacherFileInput" className={styles.dropZone}>
            Click or Drop Excel file
            <input
              id="teacherFileInput"
              type="file"
              accept=".xlsx"
              onChange={handleTeacherFileChange}
              className={styles.hiddenInput}
            />
          </label>

          {teacherFile && (
            <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
              Selected File: <strong>{teacherFile.name}</strong>
              <button
                onClick={() => {
                  setTeacherFile(null);
                  setTeacherUploadMessage('');
                }}
                style={{ marginLeft: '10px', padding: '2px 6px' }}
              >
                Clear
              </button>
            </div>
          )}

          <button
            onClick={handleTeacherUpload}
            disabled={!teacherFile || isTeacherUploading}
            className={styles.uploadBtn}
            style={{ marginTop: '12px' }}
          >
            {isTeacherUploading ? 'Uploading...' : 'Upload Excel'}
          </button>

          {!isTeacherUploading && teacherUploadMessage && (
            <p style={{ color: teacherUploadMessage.includes('success') ? 'green' : 'red', marginTop: '10px' }}>
              {teacherUploadMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTimetableUpload;
