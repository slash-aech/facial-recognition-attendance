import React, { useEffect, useState, useRef } from 'react';
import { uploadTimetable } from '../../api';

interface FacultyEntry {
  id: string;
  name: string;
  lessonIds: string[];
}

interface LessonEntry {
  id: string;
  subjectId: string;
  classroomIds: string[];
  teacherIds: string[];
  classIds: string[];
}

interface SlotEntry {
  lessonId: string;
  period: number;
  days: string;
  classroomIds: string[];
}

interface XMLPopupProps {
  file: File;
  onClose: () => void;
  meta: {
    instituteId: string;
    departmentId: string;
    semesterId: string;
    academicCalendarId: string;
  };
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const XMLPopup: React.FC<XMLPopupProps> = ({ file, onClose }) => {
  const [facultyEntries, setFacultyEntries] = useState<FacultyEntry[]>([]);
  const [lessonsMap, setLessonsMap] = useState<Record<string, LessonEntry>>({});
  const [slots, setSlots] = useState<SlotEntry[]>([]);
  const [periodMap, setPeriodMap] = useState<Record<number, string>>({});
  const [subjectMap, setSubjectMap] = useState<Record<string, string>>({});
  const [classroomMap, setClassroomMap] = useState<Record<string, string>>({});
  const [batchMap, setBatchMap] = useState<Record<string, string>>({});
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const parsedRef = useRef(false);
  const [parsedData, setParsedData] = useState<any[]>([]);

  useEffect(() => {
    if (!file || parsedRef.current) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const xml = new DOMParser().parseFromString(reader.result as string, 'text/xml');
        const parsedDataList: any[] = [];

        [
          'period', 'daysdef', 'weeksdef', 'subject', 'classroom', 'teacher', 'class', 'group', 'student', 'lesson', 'card'
        ].forEach(tag => {
          Array.from(xml.getElementsByTagName(tag)).forEach(n => {
            const entry: any = { type: tag };
            Array.from(n.attributes).forEach(attr => {
              entry[attr.name.toLowerCase()] = attr.value;
            });
            parsedDataList.push(entry);
          });
        });

        setParsedData(parsedDataList);

        const subjMap: Record<string, string> = {};
        Array.from(xml.getElementsByTagName('subject')).forEach(n => {
          const id = n.getAttribute('id');
          const name = n.getAttribute('name');
          if (id && name) subjMap[id] = name;
        });
        setSubjectMap(subjMap);

        const pMap: Record<number, string> = {};
        Array.from(xml.getElementsByTagName('period')).forEach(n => {
          const num = parseInt(n.getAttribute('period') || '0', 10);
          const start = n.getAttribute('starttime');
          const end = n.getAttribute('endtime');
          if (num && start && end) pMap[num] = `${start}-${end}`;
        });
        setPeriodMap(pMap);

        const cMap: Record<string, string> = {};
        Array.from(xml.getElementsByTagName('classroom')).forEach(n => {
          const id = n.getAttribute('id');
          const name = n.getAttribute('name');
          if (id && name) cMap[id] = name;
        });
        setClassroomMap(cMap);

        const bMap: Record<string, string> = {};
        Array.from(xml.getElementsByTagName('class')).forEach(n => {
          const id = n.getAttribute('id');
          const name = n.getAttribute('name');
          if (id && name) bMap[id] = name;
        });
        setBatchMap(bMap);

        const lessonEntries: Record<string, LessonEntry> = {};
        Array.from(xml.getElementsByTagName('lesson')).forEach(n => {
          const id = n.getAttribute('id') || '';
          const sub = n.getAttribute('subjectid') || '';
          const cls = (n.getAttribute('classroomids') || '').split(',').filter(Boolean);
          const tchr = (n.getAttribute('teacherids') || '').split(',').filter(Boolean);
          const batch = (n.getAttribute('classids') || '').split(',').filter(Boolean);
          lessonEntries[id] = { id, subjectId: sub, classroomIds: cls, teacherIds: tchr, classIds: batch };
        });
        setLessonsMap(lessonEntries);

        const slotEntries: SlotEntry[] = Array.from(xml.getElementsByTagName('card')).map(n => ({
          lessonId: n.getAttribute('lessonid') || '',
          period: parseInt(n.getAttribute('period') || '0', 10),
          days: n.getAttribute('days') || '',
          classroomIds: (n.getAttribute('classroomids') || '').split(',').filter(Boolean),
        }));
        setSlots(slotEntries);

        const faculties: FacultyEntry[] = Array.from(xml.getElementsByTagName('teacher')).map(n => {
          const tid = n.getAttribute('id') || '';
          const lessonIds = Object.values(lessonEntries)
            .filter(l => l.teacherIds.includes(tid))
            .map(l => l.id);
          return { id: tid, name: n.getAttribute('name') || 'Unnamed', lessonIds };
        });
        setFacultyEntries(faculties);

        parsedRef.current = true;
      } catch (e) {
        console.error(e);
        setError('Error parsing XML');
      }
    };

    reader.onerror = () => setError('File read error');
    reader.readAsText(file);
  }, [file]);

  useEffect(() => {
    parsedRef.current = false;
  }, []);

  const handleUpload = async () => {
    const meta = {
      instituteId: "06692d66-91d7-46b3-9f28-1ac277ac4457",
      departmentId: "2fc5cc90-7b8e-462d-a80a-9e8995c6bafe",
      semesterId: "76d90328-31d8-4e11-93df-5717057e6449",
      academicCalendarId: "2e23d149-e0e9-4b7f-8930-e5efe7255db4",
    };

    try {
      setIsUploading(true);
      setUploadMessage('');

      const transformedData = parsedData.map(entry => {
        const lowerCaseKeys = Object.fromEntries(
          Object.entries(entry).map(([k, v]) => [k.toLowerCase(), v])
        );
        return lowerCaseKeys;
      });

      const result = await uploadTimetable(transformedData, meta);
      if (result.success) {
        setUploadMessage('Upload successful!');
      } else {
        setUploadMessage(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      console.error(e);
      setUploadMessage(`Upload failed: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const renderGrid = (faculty: FacultyEntry) => {
    const grid: Record<string, Record<string, string>> = {};
    DAYS.forEach(day => {
      grid[day] = {};
      Object.values(periodMap).forEach(time => grid[day][time] = '');
    });
    slots.forEach(s => {
      if (!faculty.lessonIds.includes(s.lessonId)) return;
      s.days.split('').forEach((bit, idx) => {
        if (bit === '1') {
          const day = DAYS[idx];
          const time = periodMap[s.period];
          const les = lessonsMap[s.lessonId];
          const subj = subjectMap[les.subjectId] || les.subjectId;
          const room = classroomMap[s.classroomIds[0]] || '';
          const batch = batchMap[les.classIds[0]] || '';
          grid[day][time] = `${batch}\n${subj}\n${room}`;
        }
      });
    });

    return (
      <table border={1} cellPadding={4} style={{ width: '100%' }}>
        <thead><tr><th>Time \\ Day</th>{DAYS.map(d => <th key={d}>{d}</th>)}</tr></thead>
        <tbody>
          {Object.entries(periodMap).map(([p, time]) => (
            <tr key={p}>
              <td><strong>{time}</strong></td>
              {DAYS.map(d => <td key={d}>{grid[d][time] || '-'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:9999}}>
      <div style={{background:'#fff',padding:20,borderRadius:12,maxWidth:'90%',maxHeight:'90vh',overflowY:'auto', color:'black'}}>
        <h2>Faculty Timetable</h2>

        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : selectedFaculty ? (
          <div>
            <h3>{selectedFaculty.name}</h3>
            {renderGrid(selectedFaculty)}
            <button onClick={() => setSelectedFaculty(null)} style={{ marginTop: 10 }}>Back</button>
          </div>
        ) : (
          <table border={1} cellPadding={8} style={{ width: '100%' }}>
            <thead><tr><th>ID</th><th>Name</th><th>Action</th></tr></thead>
            <tbody>
              {facultyEntries.map((f, i) => (
                <tr key={i}>
                  <td>{f.id}</td>
                  <td>{f.name}</td>
                  <td><button onClick={() => setSelectedFaculty(f)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {facultyEntries.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}
            >
              {isUploading ? 'Uploading...' : 'Upload Timetable'}
            </button>
            {uploadMessage && (
              <p style={{ color: uploadMessage.includes('success') ? 'green' : 'red', marginTop: 10 }}>
                {uploadMessage}
              </p>
            )}
          </div>
        )}

        <button onClick={onClose} style={{ marginTop: 20 }}>Close</button>
      </div>
    </div>
  );
};

export default XMLPopup;
