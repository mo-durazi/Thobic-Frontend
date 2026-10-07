import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_SERVER_URL,
});

// Automatically attach the JWT token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
