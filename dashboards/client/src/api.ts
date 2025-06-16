import axios from "axios";

// const BASE_URL = "https://facial-recognition-attendance-backend.onrender.com/api";
const BASE_URL = "http://localhost:10000/api"
// Define types
interface RegisterFacePayload {
  subject: string;
  base64Image: string;
  email: string;
  password: string;
  user_role: string;
}

export async function fetchUserById(uniqueId: string) {
  if (!uniqueId) throw new Error("Unique ID required");
  const response = await axios.get(`${BASE_URL}/user/${uniqueId}`);
  return response.data;
}

export async function changePassword(user_info_id: string, newPassword: string) {
  if (!user_info_id || !newPassword) {
    throw new Error("user_info_id and newPassword are required");
  }

  const response = await axios.post(`${BASE_URL}/user/changePassword`, {
    user_info_id,
    newPassword,
  });

  return response.data;
}

export async function checkFaceRegistered(base64Image: string) {
  if (!base64Image) throw new Error("Base64 image required");

  const response = await axios.post(`${BASE_URL}/face/check`, {
    base64Image,
  });

  return response.data;
}

export async function registerFace({ subject, base64Image, email, password }: RegisterFacePayload) {
  if (!subject || !base64Image || !email || !password) {
    throw new Error("subject, base64Image, email and password are required");
  }

  const response = await axios.post(`${BASE_URL}/face/register`, {
    subject,
    base64Image,
    email,
    password,
  });

  return response.data;
}

export async function faceLogin(base64Image: string) {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/face-login`,
      { image: base64Image },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Login success:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    return error;
  }
}

const api = axios.create({
  baseURL: BASE_URL, // your backend URL
  withCredentials: true,  // important to send cookies
});

export default api;
