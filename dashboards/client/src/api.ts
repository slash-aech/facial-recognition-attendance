// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // your backend URL
  withCredentials: true,  // important to send cookies
});

export default api;
