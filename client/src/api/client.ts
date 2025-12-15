import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Check port matches server
  withCredentials: true, // <--- CRITICAL: MUST BE TRUE
});

export default api;