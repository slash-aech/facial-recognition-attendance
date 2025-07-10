import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { markAttendance } from '../api';

export default function MarkAttendance() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('Initializing...');
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL + `/tiny_face_detector/tiny_face_detector_model-weights_manifest.json`);
        startVideo();
      } catch (err) {
        console.error('Model load failed', err);
        setStatus('Failed to load model.');
      }
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error('Camera access denied', err);
          setStatus('Camera access denied');
        });
    };

    loadModels();
  }, []);

  useEffect(() => {
    const detectAndMark = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());

      const canvas = canvasRef.current;
      const dims = faceapi.matchDimensions(canvas, video, true);

      if (result) {
        setStatus('Face detected');
        const resizedResult = faceapi.resizeResults(result, dims);
        faceapi.draw.drawDetections(canvas, resizedResult);

        if (marking) return;
        setMarking(true);

        try {
          const imageBase64 = getScreenshot(video);
          const token = localStorage.getItem('token'); // ⬅️ must store this at login

          if (!token) {
            setStatus('Not logged in');
            return;
          }

          const res = await markAttendance(imageBase64, token);
          setStatus(res.message || 'Attendance marked!');
        } catch (err: any) {
          console.error(err);
          setStatus(err.response?.data?.message || 'Attendance failed');
        } finally {
          setMarking(false);
        }
      } else {
        setStatus('Face not visible');
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const interval = setInterval(detectAndMark, 1500);
    return () => clearInterval(interval);
  }, [marking]);

  const getScreenshot = (video: HTMLVideoElement): string => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg').split(',')[1]; // strip metadata
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Face Attendance</h1>
        <p>{status}</p>
        <video ref={videoRef} autoPlay muted width="100%" height="auto" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
