// frontend/src/pages/Home.tsx
import React from 'react';
import '../styles/Home.css'

interface HomeProps {
  onStartLogin: () => void;
  onStartRegister: () => void;
}

export default function Home({ onStartLogin, onStartRegister }: HomeProps) {
  return (
    <div className="home-container">
  <div className="home-content">
    <h1 className="home-title">
      Welcome to <span>Facial-Recognition-Attendance</span>
    </h1>
    
    <p className="home-subtitle">
      Secure access tailored to your role
    </p>
    
    <div className="home-actions">
      <button 
        onClick={onStartLogin}
        className="home-button primary"
      >
        Login
      </button>
      
      <button 
        onClick={onStartRegister}
        className="home-button secondary"
      >
        Register
      </button>
    </div>
  </div>
</div>
  );
}
