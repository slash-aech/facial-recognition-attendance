import React, { useEffect, useState, useRef } from 'react';

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
  days: string; // e.g. '010000'
  classroomIds: string[];
}

interface XMLPopupProps {
  file: File;
  onClose: () => void;
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
  const parsedRef = useRef(false);

  useEffect(() => {
    if (!file || parsedRef.current) return;
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const xml = new DOMParser().parseFromString(reader.result as string, 'text/xml');
        // Parse subjects
        const subjMap: Record<string, string> = {};
        Array.from(xml.getElementsByTagName('subject')).forEach(n => {
          const id = n.getAttribute('id');
          const name = n.getAttribute('name');
          if (id && name) subjMap[id] = name;
        });
        setSubjectMap(subjMap);
        // Parse periods
        const pMap: Record<number, string> = {};
        Array.from(xml.getElementsByTagName('period')).forEach(n => {
          const num = parseInt(n.getAttribute('period') || '0', 10);
          const start = n.getAttribute('starttime');
          const end = n.getAttribute('endtime');
          if (num && start && end) pMap[num] = `${start}-${end}`;
        });
        setPeriodMap(pMap);
        // Parse classrooms
        const cMap: Record<string, string> = {};
        Array.from(xml.getElementsByTagName('classroom')).forEach(n => {
          const id = n.getAttribute('id');
          const name = n.getAttribute('name');
          if (id && name) cMap[id] = name;
        });
        setClassroomMap(cMap);
        // Parse batches/classes
        const bMap: Record<string, string> = {};
        Array.from(xml.getElementsByTagName('class')).forEach(n => {
          const id = n.getAttribute('id');
          const name = n.getAttribute('name');
          if (id && name) bMap[id] = name;
        });
        setBatchMap(bMap);
        // Parse lessons including teacherIds and classIds
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
        // Parse slots (cards)
        const slotEntries: SlotEntry[] = Array.from(xml.getElementsByTagName('card')).map(n => ({
          lessonId: n.getAttribute('lessonid') || '',
          period: parseInt(n.getAttribute('period') || '0', 10),
          days: n.getAttribute('days') || '',
          classroomIds: (n.getAttribute('classroomids') || '').split(',').filter(Boolean),
        }));
        setSlots(slotEntries);
        // Parse teachers with filtered lessons
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
          const room = classroomMap[s.classroomIds[0]] || s.classroomIds[0] || '';
          const batch = batchMap[les.classIds[0]] || les.classIds[0] || '';
          grid[day][time] = `${batch}\n${subj}\n${room}`;
        }
      });
    });
    return (
      <table border={1} cellPadding={4} style={{ width: '100%' }}>
        <thead><tr><th>Time \ Day</th>{DAYS.map(d => <th key={d}>{d}</th>)}</tr></thead>
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
      <div style={{background:'#fff',padding:20,borderRadius:12,maxWidth:'90%',maxHeight:'90vh',overflowY:'auto'}}>
        <h2>Faculty Timetable</h2>
        {error ? <p style={{color:'red'}}>{error}</p> :
          (selectedFaculty ? (
            <div>
              <h3>{selectedFaculty.name}</h3>
              {renderGrid(selectedFaculty)}
              <button onClick={() => setSelectedFaculty(null)} style={{marginTop:10}}>Back</button>
            </div>
          ) : (
            <table border={1} cellPadding={8} style={{width:'100%'}}>
              <thead><tr><th>ID</th><th>Name</th><th>Action</th></tr></thead>
              <tbody>
                {facultyEntries.map((f,i)=>(
                  <tr key={i}><td>{f.id}</td><td>{f.name}</td><td><button onClick={()=>setSelectedFaculty(f)}>View</button></td></tr>
                ))}
              </tbody>
            </table>
          ))
        }
        <button onClick={onClose} style={{marginTop:20}}>Close</button>
      </div>
    </div>
  );
};

export default XMLPopup;
