import { useEffect, useState } from 'react';

export default function StudentProfile() {
  const [student, setStudent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with real API call to fetch student data
    const dummyStudent = {
      name: 'Rohit Sharma',
      email: 'rohit.sharma@example.com',
      rollNo: 'CS2023001',
      department: 'Computer Science',
      institute: 'Tech Institute of Engineering',
      year: '2023-2027',
    };
    setStudent(dummyStudent);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading student profile...</p>;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', color: 'white' }}>

      <main style={{ flexGrow: 1, padding: '30px', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}><span style={{ color: '#8b5cf6' }}>Student</span> Profile</h1>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '12px', maxWidth: '600px' }}>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Roll No:</strong> {student.rollNo}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>Institute:</strong> {student.institute}</p>
          <p><strong>Academic Year:</strong> {student.year}</p>
        </div>
      </main>
    </div>
  );
}
