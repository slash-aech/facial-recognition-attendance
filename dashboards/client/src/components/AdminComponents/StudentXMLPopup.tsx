import React, { useEffect, useState, useRef } from 'react';

interface ClassEntry {
  id: string;
  name: string;
}
interface LessonEntry {
  id: string;
  subjectId: string;
  teacherIds: string[];
  classroomIds: string[];
  classIds: string[];
}
interface CardEntry {
  lessonId: string;
  period: number;
  days: string;
  classroomIds: string[];
}
interface StudentPopupProps {
  file: File;
  onClose: () => void;
}

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const StudentXMLPopup: React.FC<StudentPopupProps> = ({ file, onClose }) => {
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [lessons, setLessons] = useState<Record<string, LessonEntry>>({});
  const [cards, setCards] = useState<CardEntry[]>([]);
  const [subjectMap, setSubjectMap] = useState<Record<string,string>>({});
  const [teacherMap, setTeacherMap] = useState<Record<string,string>>({});
  const [classroomMap, setClassroomMap] = useState<Record<string,string>>({});
  const [selectedClass, setSelectedClass] = useState<ClassEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const parsed = useRef(false);

  useEffect(() => {
    if (!file || parsed.current) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const xml = new DOMParser().parseFromString(reader.result as string,'text/xml');
        // classes
        const cls: ClassEntry[] = Array.from(xml.getElementsByTagName('class')).map(n=>({
          id:n.getAttribute('id')||'', name:n.getAttribute('name')||''
        }));
        setClasses(cls);
        // subjects
        const sm: Record<string,string> = {};
        Array.from(xml.getElementsByTagName('subject')).forEach(n=>{
          const id=n.getAttribute('id'), name=n.getAttribute('name');
          if(id&&name) sm[id]=name;
        }); setSubjectMap(sm);
        // teachers
        const tm: Record<string,string> = {};
        Array.from(xml.getElementsByTagName('teacher')).forEach(n=>{
          const id=n.getAttribute('id'), name=n.getAttribute('name');
          if(id&&name) tm[id]=name;
        }); setTeacherMap(tm);
        // classrooms
        const crm: Record<string,string> = {};
        Array.from(xml.getElementsByTagName('classroom')).forEach(n=>{
          const id=n.getAttribute('id'), name=n.getAttribute('name');
          if(id&&name) crm[id]=name;
        }); setClassroomMap(crm);
        // lessons
        const le: Record<string,LessonEntry> = {};
        Array.from(xml.getElementsByTagName('lesson')).forEach(n=>{
          const id=n.getAttribute('id')||'';
          le[id] = {
            id,
            subjectId:n.getAttribute('subjectid')||'',
            teacherIds:(n.getAttribute('teacherids')||'').split(',').filter(Boolean),
            classroomIds:(n.getAttribute('classroomids')||'').split(',').filter(Boolean),
            classIds:(n.getAttribute('classids')||'').split(',').filter(Boolean),
          };
        }); setLessons(le);
        // cards
        const cd: CardEntry[] = Array.from(xml.getElementsByTagName('card')).map(n=>({
          lessonId:n.getAttribute('lessonid')||'',
          period:parseInt(n.getAttribute('period')||'0',10),
          days:n.getAttribute('days')||'',
          classroomIds:(n.getAttribute('classroomids')||'').split(',').filter(Boolean)
        })); setCards(cd);

        parsed.current=true;
      } catch(e) {
        console.error(e);
        setError('Failed parse');
      }
    };
    reader.onerror=()=>setError('Read error');
    reader.readAsText(file);
  },[file]);

  const renderSchedule = () => {
    if(!selectedClass) return null;
    const grid: Record<string,Record<number,string>> = {};
    DAYS.forEach(d=>grid[d]={});
    cards.forEach(c=>{
      const lesson = lessons[c.lessonId];
      if(!lesson) return;
      if(!lesson.classIds.includes(selectedClass.id)) return;
      c.days.split('').forEach((b,i)=>{
        if(b==='1'){
          const day=DAYS[i];
          const subj=subjectMap[lesson.subjectId]||lesson.subjectId;
          const tch=teacherMap[lesson.teacherIds[0]]||lesson.teacherIds[0]||'';
          const room=classroomMap[c.classroomIds[0]]||c.classroomIds[0]||'';
          grid[day][c.period]=`${subj}\n${tch}\n${room}`;
        }
      });
    });
    const periods=[...new Set(cards.map(c=>c.period))].sort((a,b)=>a-b);
    return (
      <table border={1} cellPadding={4} style={{width:'100%',marginTop:10}}>
        <thead><tr><th>Period</th>{DAYS.map(d=><th key={d}>{d}</th>)}</tr></thead>
        <tbody>
          {periods.map(p=>(
            <tr key={p}>
              <td>{p}</td>
              {DAYS.map(d=><td key={d}>{grid[d][p]||'-'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:999}}>
      <div style={{background:'#fff',padding:20,borderRadius:8,maxHeight:'90vh',overflowY:'auto',width:'80%'}}>
        <h2>Student Timetable Preview</h2>
        {error && <p style={{color:'red'}}>{error}</p>}
        {!selectedClass ? (
          <ul>
            {classes.map(c=>(
              <li key={c.id} style={{margin:'8px 0'}}>
                {c.name} <button onClick={()=>setSelectedClass(c)}>View</button>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <h3>{selectedClass.name}</h3>
            {renderSchedule()}
            <button onClick={()=>setSelectedClass(null)} style={{marginTop:10}}>Back</button>
          </div>
        )}
        <button onClick={onClose} style={{marginTop:20}}>Close</button>
      </div>
    </div>
  );
};

export default StudentXMLPopup;