import { signinParams, signupParams } from "@/features/auth/types/authTypes";
import { useCallback } from "react";
import { http } from "@/shared/api/http";
import { getApiErrorMessage } from "@/shared/api/error";

export default function useAuthServices() {


  const Signin = useCallback( async ({ correo, contraseña }: signinParams) => {
    try {
        const response = await http.post("/auth/signin", { correo : correo, contraseña: contraseña });
        return response.data;
    }catch (error : unknown) {
        throw new Error(getApiErrorMessage(error, "Error al iniciar sesión. Por favor, verifica tus credenciales."));
    }
  }, []);

  const Signup = useCallback( async (data: signupParams) => {
    try {
      const response = await http.post("/auth/signup", data);
      return response.data; //Devuelve la info del usuario registrado
    } catch (error : unknown) {
      throw new Error(getApiErrorMessage(error, "Error al registrarse. Por favor, intenta nuevamente."));
    }
  }, []);

  const Signout = useCallback(async () => {
    try {
      const response = await http.post("/auth/signout");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, "Error al cerrar sesión."));
    }
  }, []);

  return {
    Signin,
    Signup,
    Signout
  };
}
