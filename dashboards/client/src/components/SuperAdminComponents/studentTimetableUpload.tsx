import { useEffect, useState } from 'react';
import {
  fetchAllInstitutes,
  fetchDepartmentsByInstitute,
  fetchSemesters,
  uploadTimetable,
  getSemestersBySemesterYear,
  uploadStudentData,
} from '../../api';
import api from '../../api';
import StudentXMLPopup from './StudentXMLPopup';
import styles from '../../styles/SuperAdminDashboard.module.css';

const StudentTimetableUpload = () => {
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSemesterNumber, setSelectedSemesterNumber] = useState('');

  const [instituteList, setInstituteList] = useState<any[]>([]);
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  const [semesterList, setSemesterList] = useState<any[]>([]);
  const [semesterNumberList, setSemesterNumberList] = useState<any[]>([]);

  const [showPopup, setShowPopup] = useState(false);

  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [studentUploadMessage, setStudentUploadMessage] = useState('');
  const [isStudentUploading, setIsStudentUploading] = useState(false);

  useEffect(() => {
    fetchAllInstitutes().then(setInstituteList).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedInstitute) {
      fetchDepartmentsByInstitute(selectedInstitute)
        .then(setDepartmentList)
        .catch(console.error);
    } else {
      setDepartmentList([]);
    }
    setSelectedDepartment('');
  }, [selectedInstitute]);

  useEffect(() => {
    if (selectedInstitute) {
      fetchSemesters({ instituteId: selectedInstitute })
        .then(setSemesterList)
        .catch(console.error);
    } else {
      setSemesterList([]);
    }
    setSelectedSemester('');
  }, [selectedInstitute]);


useEffect(() => {
  if (selectedSemester) {
    getSemestersBySemesterYear(selectedSemester)
      .then(data => {
        if (Array.isArray(data)) {
          setSemesterNumberList(data);
        } else {
          console.warn('Expected array, got:', data);
          setSemesterNumberList([]); // fallback
        }
      })
      .catch(err => {
        console.error(err);
        setSemesterNumberList([]);
      });
  } else {
    setSemesterNumberList([]);
  }
  console.log('Selected Semester:', semesterNumberList);
}, [selectedSemester]);

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
          semesterId: selectedSemesterNumber,
          academicCalendarId: '',
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
          institute_id: selectedInstitute,
          dept_id: selectedDepartment,
          semester_id: selectedSemesterNumber,
        });
        setUploadMessage(res || 'Student data uploaded');
      } catch (e: any) {
        setUploadMessage(e?.message || 'Failed to upload Student data');
      }
    }
  };

  const handleStudentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStudentFile(e.target.files[0]);
    }
  };

  const handleStudentUpload = async () => {
    if (!studentFile || !selectedInstitute || !selectedDepartment || !selectedSemesterNumber) {
      setStudentUploadMessage('All selections must be made before uploading.');
      return;
    }
    setIsStudentUploading(true);
    setStudentUploadMessage('');
    const formData = new FormData();
    formData.append('file', studentFile);
    formData.append('instituteId', selectedInstitute);
    formData.append('deptId', selectedDepartment);
    formData.append('semesterId', selectedSemesterNumber);

    try {
      const res = await api.post('/student-data-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = res.data;
      if (result.success) {
        setStudentUploadMessage('Student Excel Upload successful!');
      } else {
        setStudentUploadMessage(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setStudentUploadMessage(`Upload failed: ${err.message}`);
    } finally {
      setIsStudentUploading(false);
    }
  };

  return (
    <div className={styles.sectionWrapper}>
      <h1>Student Timetable Management</h1>

      <div className={styles.headerRow}>
        <select value={selectedInstitute} onChange={e => setSelectedInstitute(e.target.value)}>
          <option value="">Select Institute</option>
          {instituteList.map(inst => (
            <option key={inst.id} value={inst.id}>{inst.name}</option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          disabled={!selectedInstitute}
          onChange={e => setSelectedDepartment(e.target.value)}>
          <option value="">Select Department</option>
          {departmentList.map(dep => (
            <option key={dep.id} value={dep.id}>{dep.name}</option>
          ))}
        </select>

        <select
          value={selectedSemester}
          onChange={e => setSelectedSemester(e.target.value)}>
          <option value="">Select Semester Year</option>
          {semesterList.map(sem => (
            <option key={sem.id} value={sem.id}>{sem.semester_type}</option>
          ))}
        </select>

        <select
          value={selectedSemesterNumber}
          onChange={e => setSelectedSemesterNumber(e.target.value)}>
          <option value="">Select Semester Number</option>
          {semesterNumberList.map(sem => (
            <option key={sem.id} value={sem.id}>{sem.semester_number}</option>
          ))}
        </select>
      </div>

      <h2 className={styles.sectionTitle}>Timetable Upload</h2>
      <div className={styles.uploadModeSwitch}>
        <button onClick={() => setUploadMode('xml')} className={uploadMode === 'xml' ? styles.activeTab : ''}>XML Upload</button>
        <button onClick={() => setUploadMode('google')} className={uploadMode === 'google' ? styles.activeTab : ''}>Google Sheets</button>
      </div>

      <div className={styles.uploadBox}>
        {uploadMode === 'xml' ? (
          <div className={styles.uploadDropzone}>
            <label htmlFor="fileInput" className={styles.dropZone}>
              Click or Drop XML file
              <input id="fileInput" type="file" accept=".xml" onChange={handleFileChange} className={styles.hiddenInput} />
            </label>
            {selectedFile && showPopup && (
              <StudentXMLPopup file={selectedFile} onClose={() => setShowPopup(false)} />
            )}
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

      <h2 className={styles.sectionTitle}>Student Info Upload</h2>
      <div className={styles.uploadBox}>
        <div className={styles.uploadDropzone}>
          <label htmlFor="studentFileInput" className={styles.dropZone}>
            Click or Drop Excel file
            <input
              id="studentFileInput"
              type="file"
              accept=".xlsx"
              onChange={handleStudentFileChange}
              className={styles.hiddenInput}
            />
          </label>

          {studentFile && (
            <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
              Selected File: <strong>{studentFile.name}</strong>
              <button
                onClick={() => {
                  setStudentFile(null);
                  setStudentUploadMessage('');
                }}
                style={{ marginLeft: '10px', padding: '2px 6px' }}
              >
                Clear
              </button>
            </div>
          )}

          <button
            onClick={handleStudentUpload}
            disabled={!studentFile || isStudentUploading}
            className={styles.uploadBtn}
            style={{ marginTop: '12px' }}
          >
            {isStudentUploading ? 'Uploading...' : 'Upload Excel'}
          </button>

          {!isStudentUploading && studentUploadMessage && (
            <p style={{ color: studentUploadMessage.includes('success') ? 'green' : 'red', marginTop: '10px' }}>
              {studentUploadMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTimetableUpload;
