import axios from "axios";

export const AI_API = axios.create({
  baseURL: "https://civiclens-ai-1051.onrender.com",
});

export const BACKEND_API = axios.create({
  baseURL: "https://civiclens-backend-u9ol.onrender.com",
});

BACKEND_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});