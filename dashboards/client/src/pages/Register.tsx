import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import {
  fetchUserById,
  checkFaceRegistered,
  registerFace,
  changePassword,
} from "../api";

const videoConstraints = {
  width: 320,
  height: 320,
  facingMode: "user",
};

const RegistrationForm: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uniqueId, setUniqueId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [capturedFace, setCapturedFace] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector`);
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isModalOpen && webcamRef.current && canvasRef.current) {
      const video = webcamRef.current.video as HTMLVideoElement;
      const canvas = canvasRef.current;

      intervalId = setInterval(async () => {
        if (!video || video.paused || video.ended) return;
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi.detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions()
        );

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections) {
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const box = resizedDetections.box;
          ctx.strokeStyle = "#007bff";
          ctx.lineWidth = 3;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [isModalOpen]);

  const capture = useCallback(async () => {
    const video = webcamRef.current?.video as HTMLVideoElement;
    if (!webcamRef.current || !video) {
      setErrorMessage("Webcam not available");
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setErrorMessage("Video is not ready yet");
      return;
    }

    const detection = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (!detection) {
      setErrorMessage("No face detected. Try again.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const result = await checkFaceRegistered(imageSrc);
        if (result.registered) {
          setErrorMessage("Face already registered");
          return;
        }
        setCapturedFace(imageSrc);
        setIsModalOpen(false);
      } catch (err) {
        setErrorMessage("Error checking face registration");
      }
    }
  }, []);

  const handleGetData = async () => {
    if (!uniqueId.trim()) {
      setErrorMessage("Please enter a Unique ID");
      return;
    }
    setLoading(true);
    try {
      const userData = await fetchUserById(uniqueId.trim());
      if (!userData) throw new Error("User not found");

      setDepartmentId(userData.dept_id || "");
      setInstituteId(userData.institute_id || "");
      setEmail(userData.email_id || "");
      setUserRole(userData.user_role || "");
      setPhone(userData.mobile_no || "");
      setName(userData.full_name || "");
    } catch (error) {
      setErrorMessage("User not found or error fetching data");
      setDepartmentId("");
      setInstituteId("");
      setEmail("");
      setUserRole("");
      setPhone("");
      setName("");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!capturedFace) {
      setErrorMessage("Please capture your face before registering");
      return;
    }
    if (!uniqueId.trim()) {
      setErrorMessage("Unique ID is required");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Password is required");
      return;
    }

    const subject = uniqueId.trim();
    const base64Image = capturedFace;
    const emailClean = email.trim();
    const passwordClean = password.trim();

    setSubmitting(true);
    try {
      await registerFace({
        subject,
        base64Image,
        email: emailClean,
        password: passwordClean,
        user_role: userRole,
      });

      await changePassword(subject, passwordClean);

      setSuccessMessage("Registration successful! Redirecting to login...");
      setErrorMessage(""); // clear errors

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to register face or change password"
      );
      setSuccessMessage("");
    }
    setSubmitting(false);
  };

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.title}>GUNI ATTENDANCE - Registration</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div
            style={styles.circularFaceContainer}
            onClick={() => setIsModalOpen(true)}
            title="Click to capture face"
          >
            {capturedFace ? (
              <img
                src={capturedFace}
                alt="Captured face"
                style={styles.circularFaceImage}
              />
            ) : (
              <div style={styles.placeholderText}>Click to capture face</div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="uniqueId" style={styles.label}>
              Unique ID
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                id="uniqueId"
                type="text"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                placeholder="Enter unique ID"
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={handleGetData}
                style={styles.getDataButton}
                disabled={loading}
              >
                {loading ? "Loading..." : "Get Data"}
              </button>
            </div>
          </div>

          {[{ label: "Department ID", value: departmentId },
          { label: "Institute ID", value: instituteId },
          { label: "Email", value: email },
          { label: "Phone Number", value: phone },
          { label: "Full Name", value: name },
          ].map((field, i) => (
            <div key={i} style={styles.inputGroup}>
              <label style={styles.label}>{field.label}</label>
              <input value={field.value} readOnly style={styles.input} disabled />
            </div>
          ))}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Set Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            style={styles.registerButton}
            disabled={submitting}
          >
            {submitting ? "Registering..." : "Register"}
          </button>

          <div style={styles.loginRedirect}>
            Already have an account?{" "}
            <Link to="/login" style={styles.loginLink}>
              Login
            </Link>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ position: "relative", width: 320, height: 320 }}>
              <Webcam
                audio={false}
                height={320}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                videoConstraints={videoConstraints}
                style={{ borderRadius: 16 }}
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 320,
                  height: 320,
                  pointerEvents: "none",
                }}
              />
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={capture} style={styles.captureButton}>Capture</button>
              <button onClick={() => setIsModalOpen(false)} style={styles.modalCloseButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div style={styles.errorBox}>
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div style={styles.successBox}>
          <p>{successMessage}</p>
        </div>
      )}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 480,
    margin: "2rem auto",
    padding: "1.5rem",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    backgroundColor: "#fff",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#4A90E2",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  circularFaceContainer: {
    width: 140,
    height: 140,
    borderRadius: "50%",
    border: "3px solid #4A90E2",
    margin: "0 auto",
    cursor: "pointer",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  circularFaceImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholderText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: 4,
    fontWeight: 600,
    fontSize: 14,
  },
  input: {
    padding: "8px 12px",
    fontSize: 16,
    borderRadius: 6,
    border: "1.5px solid #ccc",
    backgroundColor: "#f9f9f9",
  },
  getDataButton: {
    backgroundColor: "#f39c12",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },
  registerButton: {
    marginTop: 16,
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "12px",
    fontWeight: 700,
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
  },
  loginRedirect: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 12,
  },
  loginLink: {
    color: "#2980b9",
    fontWeight: 600,
    textDecoration: "none",
    marginLeft: 4,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 12px 36px rgba(0,0,0,0.3)",
  },
  captureButton: {
    backgroundColor: "#2980b9",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
  },
  modalCloseButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
  },
  errorBox: {
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: 1100,
  },
  successBox: {
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: "#27ae60",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: 1100,
  },
};

export default RegistrationForm;
