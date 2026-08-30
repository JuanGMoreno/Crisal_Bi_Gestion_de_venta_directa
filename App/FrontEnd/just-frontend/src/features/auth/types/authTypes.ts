
export interface signinParams {
  correo: string;
  contraseña: string;
}

export interface signupParams {
  nombre: string;
  correo: string;
  contraseña: string;
}

export interface AuthMeUser {
  id: string;
  email: string;
}

export interface AuthMeResponse {
  message: string;
  user?: AuthMeUser;
}
