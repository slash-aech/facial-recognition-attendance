import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import '../styles/AdminDashboard.css';

interface Props {
  institute: string;
  department: string;
  year: string;
  semester: string;
}

export default function TimeTableUpload({ institute, department, year, semester }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<any[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/xml': ['.xml']
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      // Mock preview logic
      setPreview([
        { row: 1, data: 'Sample Data 1', status: 'Valid' },
        { row: 2, data: 'Sample Data 2', status: 'Error: Invalid department' }
      ]);
    }
  });

  const handleSubmit = () => {
    // POST to backend with metadata and files
    alert('Submitted timetable data');
  };

  return (
    <div className="timetable-upload">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the file here ...</p> : <p>Drag & drop or click to upload timetable (.xlsx or .xml)</p>}
      </div>

      {files.length > 0 && (
        <div className="file-preview">
          <h3>Preview</h3>
          <table>
            <thead>
              <tr>
                <th>Row</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((item, idx) => (
                <tr key={idx} className={item.status.includes('Error') ? 'error' : 'valid'}>
                  <td>{item.row}</td>
                  <td>{item.data}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="submit-btn" onClick={handleSubmit}>Submit to Database</button>
        </div>
      )}
    </div>
  );
}
