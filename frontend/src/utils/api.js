// src/utils/api.js

import axios from "axios";
import { getToken, removeToken } from "./auth";

const api = axios.create({
  baseURL: "https://iot-dashboard-v5ab.onrender.com", 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (
      status === 403 ||
      message?.includes("Invalid") ||
      message?.includes("expired")
    ) {
      console.log("🚨 Token expired or invalid → Logging out...");

      removeToken();
      
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
