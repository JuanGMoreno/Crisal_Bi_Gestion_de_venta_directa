import axios from "axios";
import { getToken , clearToken } from "./authTokens";

const AUTH_PUBLIC_ENDPOINTS = ["/auth/signin", "/auth/signup"];

function shouldHandleUnauthorizedGlobally(requestUrl?: string) {
  const isAuthEndpoint = AUTH_PUBLIC_ENDPOINTS.some((path) =>
    requestUrl?.includes(path)
  );

  if (isAuthEndpoint) return false;
  if (typeof window === "undefined") return false;
  if (window.location.pathname === "/auth/signin") return false;

  return true;
}

export const http = axios.create({
  baseURL:  "http://localhost:4001/api",
  timeout: 15000,
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

  // Para FormData, dejar que el navegador construya multipart/form-data con boundary.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// 2) Interceptor de RESPONSE: maneja errores globales
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url as string | undefined;
    // Si el token no sirve
    if (status === 401 && shouldHandleUnauthorizedGlobally(requestUrl)) {
      clearToken();
      window.location.replace("/auth/signin");
    }

    // Deja el error para que lo maneje el feature si quiere
    return Promise.reject(error);
  }
);