import { useState } from 'react';
import api from '../api';
import styles from '../styles/SuperAdminDashboard.module.css';

const FacultyTimetableUpload = () => {
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [semType, setSemType] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const oddSemesters = ['1st', '3rd', '5th', '7th'];
  const evenSemesters = ['2nd', '4th', '6th', '8th'];
  const displayedSemesters =
    semType === 'odd' ? oddSemesters : semType === 'even' ? evenSemesters : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (uploadMode === 'xml' && selectedFile) {
      console.log('Uploading XML:', selectedFile);
    } else if (uploadMode === 'google') {
      const sheetId = extractSheetId(googleSheetUrl);
      if (!sheetId) return setUploadMessage('Invalid Google Sheet URL');
      api
        .post('/faculty/upload', { sheetId })
        .then((res) =>
          setUploadMessage(res.data?.message || 'Sheet uploaded successfully')
        )
        .catch(() =>
          setUploadMessage('Failed to upload sheet (Maybe wrong format or incomplete field)')
        );
    }
  };

  const extractSheetId = (url: string): string | null => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className={styles.sectionWrapper}>
      <h1>Student Timetable Management</h1>
      <div className={styles.headerRow}>
        <select
          value={selectedInstitute}
          onChange={(e) => setSelectedInstitute(e.target.value)}
        >
          <option value="">Institute</option>
          <option value="UVPCOE">UVPCOE</option>
        </select>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
        </select>

        <select
          value={semType}
          onChange={(e) => {
            setSemType(e.target.value);
            setSelectedSemester('');
          }}
        >
          <option value="">Select Type</option>
          <option value="odd">Odd Semester</option>
          <option value="even">Even Semester</option>
        </select>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          disabled={!semType}
        >
          <option value="">Select Semester</option>
          {displayedSemesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.dateRangeWrapper}>
        <h3>
          <u>Select Academic Year</u>
        </h3>
        <select
          value={endDate}
          onChange={(e) => setStartDate(e.target.value)}>
          <option value="">Select start date</option>
          <option value="June 24">June 24</option>
          <option value="June 25">June 25</option>
        </select>
        <select
          value={startDate}
          onChange={(e) => setEndDate(e.target.value)}>
          <option value="">Select end date</option>
          <option value="August 24">August 24</option>
          <option value="August 25">August 25</option>
        </select>
      </div>

      <h2 className={styles.sectionTitle}>Student Timetable Upload</h2>
      <div className={styles.uploadModeSwitch}>
        <button
          className={uploadMode === 'xml' ? styles.activeTab : ''}
          onClick={() => setUploadMode('xml')}
        >
          XML Upload
        </button>
        <button
          className={uploadMode === 'google' ? styles.activeTab : ''}
          onClick={() => setUploadMode('google')}
        >
          Google Sheets
        </button>
      </div>

      <div className={styles.uploadBox}>
        {uploadMode === 'xml' ? (
          <div className={styles.uploadDropzone}>
            <label htmlFor="fileInput" className={styles.dropZone}>
              Click to add or drop the file here
              <input
                id="fileInput"
                type="file"
                accept=".xml"
                onChange={handleFileChange}
                className={styles.hiddenInput}
              />
            </label>
            {selectedFile && <p>Selected File: {selectedFile.name}</p>}
            <button onClick={handleUpload} className={styles.uploadBtn}>
              Upload XML
            </button>
          </div>
        ) : (
          <div className={styles.uploadDropzone}>
            <input
              type="text"
              placeholder="Paste Google Sheets URL here"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
            />
            <button onClick={handleUpload} className={styles.uploadBtn}>
              Submit URL
            </button>
            {uploadMessage && <p>{uploadMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyTimetableUpload;
