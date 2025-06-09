// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import HODDashboard from './pages/dashboard/HODDashboard';
import SuperadminDashboard from './pages/dashboard/SuperAdminDashboard';

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

const AppRoutes: React.FC<AppRoutesProps> = ({ role, setRole }) => {
  // Wrapper for login and register routes to pass props if needed
  const navigate = useNavigate();

  const handleLogin = (newRole: string) => {
    setRole(newRole);
    navigate(`/${newRole}`);
  };

// const handleLogout = () => {
//   setRole(null); // update role immediately on logout
// };


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
              onLogin={handleLogin}
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
            <Register onSwitchToLogin={() => navigate('/login')} />
          )
        }
      />

      {/* Role-based dashboards */}
      <Route
        path="/student"
        element={
          role === 'student' ? <StudentDashboard  /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/teacher"
        element={
          role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/admin"
        element={
          role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/hod"
        element={
          role === 'hod' ? <HODDashboard /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/superadmin"
        element={
          role === 'superadmin' ? <SuperadminDashboard /> : <Navigate to="/" replace />
        }
      />

      {/* Catch all - redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
