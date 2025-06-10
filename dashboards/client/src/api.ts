// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://facial-recognition-attendance-backend.onrender.com', // your backend URL
  withCredentials: true,  // important to send cookies
});

export default api;
