// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import api from './api'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import HODDashboard from './pages/dashboard/HODDashboard';
import SuperadminDashboard from './pages/dashboard/SuperAdminDashboard';
import FunctionTester from './pages/test'
import MarkAttendance from './pages/Attendance';

export default function App() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/check');
        setRole(res.data.role);
      } catch (err) {
        setRole(null); // not logged in
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);


  if (loading) return <div>Loading...</div>;

  return (
      <AppRoutes role={role} setRole={setRole} />
  );
}

interface AppRoutesProps {
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const HomeWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Home
      onStartLogin={() => navigate('/login')}
      onStartRegister={() => navigate('/register')}
    />
  );
};

const AppRoutes: React.FC<AppRoutesProps> = ({ role, setRole  }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={role ? <Navigate to={`/${role}`} replace /> : <HomeWrapper />}
      />

      <Route
        path="/login"
        element={
          role ? (
            <Navigate to={`/${role}`} replace />
          ) : (
            <Login
              onLogin={setRole}
              onSwitchToRegister={() => navigate('/register')}
            />
          )
        }
      />

      <Route
        path="/register"
        element={
          role ? (
            <Navigate to={`/${role}`} replace />
          ) : (
            <Register />
          )
        }
      />

      <Route
        path="/student"
        element={
          // role === 'student' ? <StudentDashboard /> :  <StudentDashboard />
          role === 'student' ? <StudentDashboard /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/teacher"
        element={
          // role === 'teacher' ? <TeacherDashboard /> : <TeacherDashboard />
          role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/admin"
        element={ 
          // role === 'admin' ? <AdminDashboard /> : <AdminDashboard />
          role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/hod"
        element={
          // role === 'hod' ? <HODDashboard /> : <HODDashboard />
          role === 'hod' ? <HODDashboard /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/superadmin"
        element={
          // role === 'superadmin' ? <SuperadminDashboard /> : <SuperadminDashboard />
          role === 'superadmin' ? <SuperadminDashboard /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/test"
        element={
          <FunctionTester />
          // role === 'superadmin' ? <SuperadminDashboard /> : <Navigate to="/" replace />
        }
      />
      <Route path="/att" element={<MarkAttendance />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
