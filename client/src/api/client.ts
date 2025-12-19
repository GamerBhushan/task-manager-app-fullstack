import axios from 'axios';

// 👇 THIS LINE IS THE CULPRIT
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for CORS
});

export default api;