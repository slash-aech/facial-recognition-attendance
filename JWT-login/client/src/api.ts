// frontend/src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true // if you add refresh‐token cookie later
});

export default api;
