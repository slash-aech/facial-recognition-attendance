import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FaceLogin from './face-login';
import RegistrationForm from './Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FaceLogin />} />
        <Route path="/login" element={<FaceLogin />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
