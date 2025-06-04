import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import { fetchUserById } from "./api/api.js";

const videoConstraints = {
  width: 320,
  height: 320,
  facingMode: "user",
};

const RegistrationForm: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [uniqueId, setUniqueId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [capturedFace, setCapturedFace] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // New state for error message
  const [errorMessage, setErrorMessage] = useState("");

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedFace(imageSrc);
        setIsModalOpen(false);
      }
    }
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 4000); // Clear error after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleGetData = async () => {
    if (!uniqueId.trim()) {
      setErrorMessage("Please enter a Unique ID");
      return;
    }
    setLoading(true);
    try {
      const userData = await fetchUserById(uniqueId.trim());
      if (!userData) {
        throw new Error("User not found");
      }
      setDepartmentId(userData.dept_id || "");
      setInstituteId(userData.institute_id || "");
      setEmail(userData.email || "");
      setPhone(userData.mobile_no || "");
      setName(userData.full_name || "");
    } catch (error) {
      setErrorMessage("User not found or error fetching data");
      setDepartmentId("");
      setInstituteId("");
      setEmail("");
      setPhone("");
      setName("");
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      uniqueId,
      departmentId,
      instituteId,
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
                disabled={loading}
              >
                {loading ? "Loading..." : "Get Data"}
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="departmentId" style={styles.label}>
              Department ID
            </label>
            <input
              id="departmentId"
              type="text"
              value={departmentId}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="instituteId" style={styles.label}>
              Institute ID
            </label>
            <input
              id="instituteId"
              type="text"
              value={instituteId}
              readOnly
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
              readOnly
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
              readOnly
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
              readOnly
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
            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 12,
                justifyContent: "center",
              }}
            >
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

      {/* Error box at bottom right */}
      {errorMessage && (
        <div style={styles.errorBox}>
          <p>{errorMessage}</p>
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

  // New styles for error box
  errorBox: {
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "0px 15px",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    fontWeight: "600",
    zIndex: 1100,
    maxWidth: 300,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};

export default RegistrationForm;
