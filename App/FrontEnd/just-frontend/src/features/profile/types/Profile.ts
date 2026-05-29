export type DistributorProfile = {
  id_distribuidor: string;
  id_usuario: string;
  nombre: string;
  rol: "Consultora" | "Lider de Grupo" | "Lider";
  foto_avatar?: string | null;
  codigo_referido?: string | null;
  fecha_vencimiento_codigo?: string | null;
  estado: "Activo" | "Inactivo";
  createdAt: string;
  updatedAt: string;
  usuario: {
    id_usuario: string;
    correo: string;
    estado: "Activo" | "Inactivo";
    createdAt: string;
    updatedAt: string;
  };
  padre?: {
    id_distribuidor: string;
    nombre: string;
    rol: "Consultora" | "Lider de Grupo" | "Lider";
    foto_avatar?: string | null;
    codigo_referido?: string | null;
    fecha_vencimiento_codigo?: string | null;
    estado: "Activo" | "Inactivo";
  } | null;
};

export type DistributorChild = {
  id_distribuidor: string;
  id_usuario: string;
  nombre: string;
  rol: "Consultora" | "Lider de Grupo" | "Lider";
  foto_avatar?: string | null;
  estado: "Activo" | "Inactivo";
  createdAt: string;
  updatedAt: string;
  usuario: {
    id_usuario: string;
    correo: string;
    estado: "Activo" | "Inactivo";
    createdAt: string;
    updatedAt: string;
  };
};
