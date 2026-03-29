import axios from "axios";

type ApiErrorPayload = {
  message?: string;
  error?: string;
};

export function getApiErrorMessage(error: unknown, fallback = "Ocurrio un error inesperado") {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const data = error.response?.data;

    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (!error.response) {
      return "No se pudo conectar con el servidor";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}