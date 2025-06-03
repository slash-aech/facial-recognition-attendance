// frontend/src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Home              from './pages/Home';
import Register          from './pages/Register';
import Login             from './pages/Login';
import AdminDashboard    from './pages/AdminDashboard';
import ManagerDashboard  from './pages/ManagerDashboard';
import EditorDashboard   from './pages/EditorDashboard';
import UserDashboard     from './pages/UserDashboard';
import GuestDashboard    from './pages/GuestDashboard';
import { LoginResponse } from './types';
import { useEffect } from 'react';

function App() {
  const [token, setToken] = useState('');
  const [role, setRole]   = useState(''); // one of 'admin','manager','editor','user','guest'
//   useEffect(() => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     useNavigate()('/login');
//   }
// }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login setToken={setToken} setRole={setRole} />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            token && role === 'admin' 
              ? <AdminDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Manager Dashboard */}
        <Route
          path="/dashboard/manager"
          element={
            token && role === 'manager'
              ? <ManagerDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Editor Dashboard */}
        <Route
          path="/dashboard/editor"
          element={
            token && role === 'editor'
              ? <EditorDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* User Dashboard */}
        <Route
          path="/dashboard/user"
          element={
            token && role === 'user'
              ? <UserDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Guest Dashboard */}
        <Route
          path="/dashboard/guest"
          element={
            token && role === 'guest'
              ? <GuestDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Fallback: any other path → Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;