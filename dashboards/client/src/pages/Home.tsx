// frontend/src/pages/Home.tsx
import React from 'react';

interface HomeProps {
  onStartLogin: () => void;
  onStartRegister: () => void;
}

export default function Home({ onStartLogin, onStartRegister }: HomeProps) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to the Role-Based App</h1>
      <button onClick={onStartLogin}>Login</button>
      <button onClick={onStartRegister}>Register</button>
    </div>
  );
}
