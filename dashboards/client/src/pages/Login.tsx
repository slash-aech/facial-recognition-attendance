import  { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import api from '../api';
import '../styles/Login.css';

export default function login({
  onLogin,
  onSwitchToRegister,
}: {
  onLogin: (role: string) => void;
  onSwitchToRegister: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState('Initializing...');
  const [showBasicLogin, setShowBasicLogin] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Load face models and start video
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(
          MODEL_URL + `/tiny_face_detector/tiny_face_detector_model-weights_manifest.json`
        );
        startVideo();
      } catch (err) {
        console.error('Model load failed', err);
        setShowBasicLogin(true);
      }
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Camera access denied', err);
          setShowBasicLogin(true);
        });
    };

    loadModels();
    const fallbackTimer = setTimeout(() => {
      if (!loggingIn) setShowBasicLogin(true);
    }, 10000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Face login detection loop
  useEffect(() => {
    const detectAndLogin = async () => {
      if (!videoRef.current || !canvasRef.current || showBasicLogin) return;

      const video = videoRef.current;
      const result = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      const canvas = canvasRef.current;
      const dims = faceapi.matchDimensions(canvas, video, true);

      if (result) {
        setStatus('Face detected');
        const resizedResult = faceapi.resizeResults(result, dims);
        faceapi.draw.drawDetections(canvas, resizedResult);

        if (loggingIn) return;
        setLoggingIn(true);
        try {
          const faceBase64 = getScreenshot(video);
          const res = await api.post('/auth/facelogin', { image: faceBase64 },  { withCredentials: true });
          onLogin(res.data.role);
        } catch (err: any) {
          setStatus(err.response?.data?.message || 'Face login failed');
          setShowBasicLogin(true);
        } finally {
          setLoggingIn(false);
        }
      } else {
        setStatus('Face not visible');
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const interval = setInterval(detectAndLogin, 1500);
    return () => clearInterval(interval);
  }, [loggingIn, showBasicLogin]);

  const getScreenshot = (video: HTMLVideoElement): string => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg').split(',')[1];
  };
  

  const handleBasicLogin = async () => {
    try {
      console.log("trying to log in")
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data.role);
    } catch {
      setMessage('Login failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {!showBasicLogin ? (
          <>
            <h1 className="auth-title">Face Login</h1>
            <p>{status}</p>
            <video ref={videoRef} autoPlay muted width="100%" height="auto" />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <p>If face login fails, basic login will appear shortly.</p>
          </>
        ) : (
          <>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to access your account</p>

            <div className="auth-form">
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="auth-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                />
              </div>

              <button onClick={handleBasicLogin} className="auth-button primary">
                Login
              </button>

              {message && <p className="auth-message">{message}</p>}
            </div>

            <div className="auth-footer">
              <p>Don't have an account?</p>
              <button onClick={onSwitchToRegister} className="auth-button text-button">
                Register here
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
