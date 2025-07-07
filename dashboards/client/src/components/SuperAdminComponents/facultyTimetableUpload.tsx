import { useEffect, useState } from 'react';
import {
  fetchAllInstitutes,
  fetchDepartmentsByInstitute,
} from '../../api';
import api from '../../api';
import XMLPopup from './FacultyXMLPopup';
import styles from '../../styles/SuperAdminDashboard.module.css';

const FacultyTimetableUpload = () => {
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  let isLoading = false; // Placeholder for loading state, can be replaced with actual state management
  const [showPopup, setShowPopup] = useState(false);
  const [teacherFile, setTeacherFile] = useState<File | null>(null);
  const [teacherUploadMessage, setTeacherUploadMessage] = useState('');
  const [isTeacherUploading, setIsTeacherUploading] = useState(false);

  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  // const [selectedFaculty, setSelectedFaculty] = useState('');
  // const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  // const [selectedSemester, setSelectedSemester] = useState('');

  const [instituteList, setInstituteList] = useState<any[]>([]);
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  // const [facultyList, setFacultyList] = useState<any[]>([]);
  // const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  // const [semesterList, setSemesterList] = useState<Semester[]>([]);

  useEffect(() => {
    console
    fetchAllInstitutes().then(setInstituteList).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedInstitute) {
      console.log('Fetching departments for institute:', selectedInstitute);
      fetchDepartmentsByInstitute(selectedInstitute)
        .then(setDepartmentList)
        .catch(console.error);
    } else {
      setDepartmentList([]);
    }
    setSelectedDepartment('');
  }, [selectedInstitute]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowPopup(true);
    }
  };

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
        const res = await api.post('/faculty-data-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      });
    const result = res.data;
      if (result.success) {
        setTeacherUploadMessage('Teacher Excel Upload successful!');
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
      <h1>Faculty Timetable Management</h1>

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
              <input
                id="fileInput"
                type="file"
                accept=".xml"
                onChange={handleFileChange}
                className={styles.hiddenInput}
              />
            </label>

            {selectedFile && (
              <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
                Selected File: <strong>{selectedFile.name}</strong>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setShowPopup(false);
                    setUploadMessage('');
                  }}
                  style={{ marginLeft: '10px', padding: '2px 6px' }}
                >
                  Clear
                </button>
              </div>
            )}

            {isLoading && <p style={{ color: 'blue', marginTop: '10px' }}>Uploading...</p>}
            {!isLoading && uploadMessage && (
              <p style={{ color: uploadMessage.includes('success') ? 'green' : 'red', marginTop: '10px' }}>
                {uploadMessage}
              </p>
            )}

            {selectedFile && showPopup && (
              <XMLPopup
                file={selectedFile}
                onClose={() => setShowPopup(false)}
                meta={{
                  instituteId: selectedInstitute,
                  departmentId: selectedDepartment,
                  semesterId: 'selectedSemester',
                  academicCalendarId: 'selectedAcademicYear',
                }}
              />
            )}
          </div>
        ) : (
          <div className={styles.uploadDropzone}>
            <input
              type="text"
              placeholder="Google Sheet URL"
              value={googleSheetUrl}
              onChange={e => setGoogleSheetUrl(e.target.value)}
            />
            <button className={styles.uploadBtn}>Submit URL</button>
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

export default FacultyTimetableUpload;
