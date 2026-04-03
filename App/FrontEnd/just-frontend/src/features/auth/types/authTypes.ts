
export interface signinParams {
  correo: string;
  contraseña: string;
}

export interface signupParams {
  nombre: string;
  correo: string;
  contraseña: string;
  rol: "Consultora" | "Lider de Grupo" | "Lider";
}