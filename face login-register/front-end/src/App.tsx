import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FaceLogin from './assets/Pages/face-login';
import RegistrationForm from './assets/Pages/Register';
// import ProtectedRoutes from './assets/Components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<FaceLogin />} />
        <Route path="/register" element={<RegistrationForm />} />
        {/* <Route element={<ProtectedRoutes allowedRoles={['student']} />}>
          <Route path="/" element={<StudentDashboard />} />
        </Route>
        <Route element={<ProtectedRoutes allowedRoles={['teacher']} />}>
          <Route path="/" element={<TeacherDashboard />} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
