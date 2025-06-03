import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Link } from 'react-router-dom';

const FaceLogin: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(
          MODEL_URL + `/tiny_face_detector/tiny_face_detector_model-weights_manifest.json`
        ),
      ]);
      startVideo();
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
          setStatus('Camera access denied');
          console.error(err);
        });
    };

    loadModels();
  }, []);

  useEffect(() => {
    const detect = async () => {
      if (videoRef.current && canvasRef.current) {
        const result = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        const canvas = canvasRef.current;
        const dims = faceapi.matchDimensions(canvas, videoRef.current, true);

        if (result) {
          setStatus('Face detected');
          const resizedResult = faceapi.resizeResults(result, dims);
          faceapi.draw.drawDetections(canvas, resizedResult);
        } else {
          setStatus('Face Not visible');
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    const interval = setInterval(detect, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '40px auto',
        padding: 10,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        textAlign: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
      }}
    >
      <h2
        style={{
          marginBottom: 10,
          fontWeight: 600,
          fontSize: '1.5rem',
          color: '#222',
        }}
      >
        {status}
      </h2>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 640,
          aspectRatio: '4 / 3',
          margin: '0 auto',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          border: '1px solid #ddd',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 12,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 12,
            zIndex: 1,
          }}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <Link
          to="/register"
          style={{
            fontSize: '1rem',
            color: '#007bff',
            textDecoration: 'underline',
            fontWeight: 500,
            transition: 'color 0.2s ease-in-out',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0056b3')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#007bff')}
        >
          Don't have an account? Register here →
        </Link>
      </div>
    </div>
  );
};

export default FaceLogin;
