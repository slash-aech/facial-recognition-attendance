import React, { useState } from 'react';
import styles from '../styles/SuperAdminDashboard.module.css';
import api from '../api';

const StudentManagement = () => {
  const [selectedInstitute, setSelectedInstitute] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'xml' | 'google'>('xml');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [studentUploadMessage, setSUploadMessage] = useState('');

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
      if (!sheetId) return setSUploadMessage('Invalid Google Sheet URL');
      api.post('/student/data', { sheetId })
        .then(res => setSUploadMessage(res.data?.message || 'Sheet uploaded successfully'))
        .catch(() => setSUploadMessage('Failed to upload sheet (Maybe wrong format or incomplete field)'));
    }
  };

  const extractSheetId = (url: string): string | null => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.headerRow}>
        <select value={selectedInstitute} onChange={e => setSelectedInstitute(e.target.value)}>
          <option value=''>Select Institute</option>
          <option value='Institute A'>Institute A</option>
          <option value='Institute B'>Institute B</option>
        </select>
        <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
          <option value=''>Select Department</option>
          <option value='CSE'>CSE</option>
          <option value='ECE'>ECE</option>
        </select>
        <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
          <option value=''>Select Batch</option>
          <option value='2022'>2022</option>
          <option value='2023'>2023</option>
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
            {studentUploadMessage && <p>{studentUploadMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
