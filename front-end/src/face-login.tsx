import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './face-login.css'


const FaceLogin: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL+`/tiny_face_detector/tiny_face_detector_model-weights_manifest.json`),
        // faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL+`/face_landmark_68/face_landmark_68_model-weights_manifest.json`),
      ]);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
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
      if (videoRef.current  && canvasRef.current) {
        // const video = videoRef.current;
        const result = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        const canvas = canvasRef.current;
        const dims = faceapi.matchDimensions(canvas, videoRef.current, true);
        // faceapi.clearCanvas(canvas);
        if (result) {
          setStatus('Face detected');
          const resizedResult = faceapi.resizeResults(result, dims);
          faceapi.draw.drawDetections(canvas, resizedResult);
        } else {
          setStatus('Face Not visible');
        }
      }
    };

    const interval = setInterval(detect, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className='main'>
      <h2>{status}</h2>
      <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        style={{ border: '1px solid black' }}
      />
      <canvas className='border'
        ref={canvasRef}
        width="500"
        height="400"
      />
      </div>
    </span>
  );
};

export default FaceLogin;
