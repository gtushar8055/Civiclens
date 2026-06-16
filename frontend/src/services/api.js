import axios from "axios";

export const AI_API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const BACKEND_API = axios.create({
  baseURL: "http://localhost:5000",
});

BACKEND_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});