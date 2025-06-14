import { useState } from 'react';
import api from '../api';
import '../styles//Register.css'

export default function Register({
  onSwitchToLogin,
}: {
  onSwitchToLogin: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [department, setdepartment] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {   
      await api.post('/auth/register', { email, password, role, department });
      setMessage('Registration successful. Please login.');
      navigate('/login');
    } catch {
      setMessage('Registration failed.');
    }
  };

  return (
    <div className="auth-container" style={{ padding: 0 }}>
  <form className="auth-form" onSubmit={handleRegister}>
    <h1 className="auth-title">Create Account</h1>
    <p className="auth-subtitle">Join our platform today</p>

    <div className="input-group">
      <input
        name="mail"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="auth-input"
      />
    </div>

    <div className="input-group">
      <input
        name="pass"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="auth-input"
      />
    </div>

    <div className="input-group">
      <select
        name="role"
        value={role}
        onChange={e => setRole(e.target.value)}
        required
        className="auth-select"
      >
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
        <option value="hod">HOD</option>
        <option value="superadmin">Superadmin</option>
      </select>
    </div>
    <div className="input-group">
      <select
        name="department"
        value={department}
        onChange={e => setdepartment(e.target.value)}
        className="auth-select"
      >
        <option value="">Select department</option>
        <option value="CSE">CSE</option>
        <option value="CE">CE</option>
        <option value="ME">ME</option>
        <option value="CE">CE</option>
        <option value="ECE">ECE</option>
      </select>
    </div>

    <button type="submit" className="auth-button primary">
      Register
    </button>

    {message && <p className="auth-message">{message}</p>}

    <div className="auth-footer">
      <p>Already have an account?</p>
      <button 
        type="button" 
        onClick={onSwitchToLogin}
        className="auth-button text-button"
      >
        Login here
      </button>
    </div>
  </form>
</div>
  );
}
