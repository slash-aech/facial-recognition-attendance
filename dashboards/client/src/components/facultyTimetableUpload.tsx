// components/FacultyTimetableUpload.tsx
import  { useState } from 'react';
import api from '../api';
import styles from '../styles/SuperAdminDashboard.module.css';

const FacultyTimetableUpload = () => {
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [facultyUploadMessage, setFUploadMessage] = useState('');

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
      if (!sheetId) return setFUploadMessage('Invalid Google Sheet URL');
      api.post('/faculty/upload', { sheetId })
        .then(res => setFUploadMessage(res.data?.message || 'Sheet uploaded successfully'))
        .catch(() => setFUploadMessage('Failed to upload sheet (Maybe wrong format or incomplete field)'));
    }
  };

  const extractSheetId = (url: string): string | null => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.headerRow}> {/* Dummy header */}
        <select>
          <option>Academic Year</option>
        </select>
        <select>
          <option>Semester</option>
        </select>
      </div>
      <h2 className={styles.sectionTitle}>Faculty Timetable Upload</h2>
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
            {facultyUploadMessage && <p>{facultyUploadMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyTimetableUpload;
