import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom"; // ← Add this
import Webcam from "react-webcam";

const videoConstraints = {
  width: 320,
  height: 320,
  facingMode: "user",
};

const RegistrationForm: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [uniqueId, setUniqueId] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [capturedFace, setCapturedFace] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedFace(imageSrc);
        setIsModalOpen(false);
      }
    }
  }, []);

  const handleGetData = () => {
    alert(`Fetching data for Unique ID: ${uniqueId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      uniqueId,
      schoolId,
      email,
      phone,
      name,
      password,
      capturedFace,
    });
    alert("Registration submitted!");
  };

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.title}>Registration Form</h2>
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
              >
                Get Data
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="schoolId" style={styles.label}>
              School ID
            </label>
            <input
              id="schoolId"
              type="text"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              placeholder="Enter school ID"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="phone" style={styles.label}>
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Set Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.registerButton}>
            Register
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
            <Webcam
              audio={false}
              height={320}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              videoConstraints={videoConstraints}
              style={{ borderRadius: 16 }}
            />
            <div style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={capture} style={styles.captureButton}>
                Capture
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={styles.modalCloseButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 450,
    margin: "2rem auto",
    padding: "1.5rem",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fff",
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
    margin: "0 auto 1rem auto",
    cursor: "pointer",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    boxShadow: "0 4px 12px rgba(74,144,226,0.4)",
    userSelect: "none",
  },
  circularFaceImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholderText: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
    padding: "0 10px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: 6,
    fontWeight: 600,
    color: "#333",
  },
  input: {
    padding: "8px 12px",
    fontSize: 16,
    borderRadius: 6,
    border: "1.5px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s",
  },
  getDataButton: {
    backgroundColor: "#f39c12",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  registerButton: {
    marginTop: "1rem",
    padding: "12px",
    backgroundColor: "#27ae60",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  captureButton: {
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#2980b9",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
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
  modalCloseButton: {
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#e74c3c",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
  },
  loginRedirect: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  loginLink: {
    color: "#2980b9",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: 6,
  },
};

export default RegistrationForm;
