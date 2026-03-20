import axios from "axios";
import { getToken , clearToken } from "./authTokens";

export const http = axios.create({
  baseURL:  "http://localhost:4000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1) Interceptor de REQUEST: agrega token si existe
http.interceptors.request.use((config) => {
  // Este código corre antes de enviar la petición
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 2) Interceptor de RESPONSE: maneja errores globales
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Si el token no sirve
    if (status === 401 && typeof window !== "undefined") {
      clearToken();
      // Redirección simple; luego puedes hacerlo con router
      window.location.href = "/login";
    }

    // Deja el error para que lo maneje el feature si quiere
    return Promise.reject(error);
  }
);