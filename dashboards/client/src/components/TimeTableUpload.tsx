import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadTimetable } from '../api'; // ✅ Adjust path if needed
import '../styles/SuperAdminDashboard.module.css';

interface Props {
  institute: string;
  department: string;
  year: string;
  semester: string;
  academicCalendarId: string;
}

type MessageType = 'error' | 'success' | '';

const TimeTableUpload: React.FC<Props> = ({
  institute,
  department,
  year,
  semester,
  academicCalendarId,
}) => {
  const [fileName, setFileName] = useState('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('');

  const showMessage = (msg: string, type: MessageType = 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };

  const parseXML = async (file: File) => {
    const xmlText = await file.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'application/xml');

    const extract = (tag: string, attrs: string[]) =>
      Array.from(xml.getElementsByTagName(tag)).map((node: any, idx) => {
        const row: any = { type: tag, row: idx + 1 };
        attrs.forEach(attr => {
          row[attr.toLowerCase()] = node.getAttribute(attr) || '';
        });
        return row;
      });

    const periods = extract('period', ['name', 'short', 'period', 'starttime', 'endtime']);
    const daysdefs = extract('daysdef', ['id', 'name', 'short', 'days']);
    const weeksdefs = extract('weeksdef', ['id', 'name', 'short', 'weeks']);
    const subjects = extract('subject', ['id', 'name', 'short', 'partner_id']);
    const teachers = extract('teacher', ['id', 'firstname', 'lastname', 'name', 'short', 'gender', 'color', 'email', 'mobile', 'partner_id']);
    const classrooms = extract('classroom', ['id', 'name', 'short', 'capacity', 'buildingid', 'partner_id']);
    const classes = extract('class', ['id', 'name', 'short', 'classroomids', 'teacherid', 'grade', 'partner_id']);
    const groups = extract('group', ['id', 'classid', 'name', 'entireclass', 'divisiontag', 'studentcount', 'studentids']);
    const students = extract('student', ['id', 'classid', 'name', 'number', 'email', 'mobile', 'partner_id', 'firstname', 'lastname']);
    const lessons = extract('lesson', [
      'id', 'subjectid', 'classids', 'groupids', 'teacherids',
      'classroomids', 'periodspercard', 'periodsperweek',
      'daysdefid', 'weeksdefid', 'termsdefid', 'seminargroup',
      'capacity', 'partner_id'
    ]);
    const cards = extract('card', ['lessonid', 'classroomids', 'period', 'weeks', 'days', 'terms']);

    const allRows = [
      ...periods, ...daysdefs, ...weeksdefs,
      ...subjects, ...teachers, ...classrooms,
      ...classes, ...groups, ...students,
      ...lessons, ...cards
    ];

    setPreviewData(allRows);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/xml': ['.xml'] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (!institute || !department || !year || !semester || !academicCalendarId) {
        showMessage('Please select all 5 options before uploading.', 'error');
        return;
      }

      const file = acceptedFiles[0];
      if (!file || !file.name.endsWith('.xml')) {
        showMessage('Invalid file type. Please upload a .xml file.', 'error');
        return;
      }

      setFileName(file.name);
      parseXML(file);
      showMessage('File uploaded and parsed successfully!', 'success');
    }
  });

  const handleSubmit = async () => {
    if (!previewData.length) {
      showMessage('No timetable data found to upload.', 'error');
      return;
    }

    const meta = {
      instituteId: institute,
      departmentId: department,
      semesterId: semester,
      academicCalendarId: academicCalendarId,
    };

    try {
      const res = await uploadTimetable(previewData, meta);
      if (res.success) {
        showMessage('Timetable uploaded successfully!', 'success');
        setPreviewData([]); // clear preview if needed
        setFileName('');
      } else {
        showMessage(`Upload failed: ${res.error}`, 'error');
      }
    } catch (err: any) {
      showMessage(`Unexpected error: ${err.message}`, 'error');
    }
  };

  return (
    <div className="timetable-upload">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive
          ? <p>Drop your .xml file here ...</p>
          : <p>{fileName ? `File selected: ${fileName}` : 'Drag & drop XML file or click to select'}</p>}
      </div>

      {previewData.length > 0 && (
        <div className="preview-container">
          <h3>Timetable XML Preview</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tag Type</th>
                  <th>Attributes</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{row.type}</td>
                    <td>
                      {Object.entries(row)
                        .filter(([k]) => k !== 'type' && k !== 'row')
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' • ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            Submit to Database
          </button>
        </div>
      )}

      {message && (
        <div className={`toast ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default TimeTableUpload;
