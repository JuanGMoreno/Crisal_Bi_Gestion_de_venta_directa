export type DistributorProfile = {
  id_distribuidor: string;
  id_usuario: string;
  nombre: string;
  foto_avatar?: string | null;
  estado: 'Activo' | 'Inactivo';
  createdAt: string;
  updatedAt: string;
  usuario: {
    id_usuario: string;
    correo: string;
    estado: 'Activo' | 'Inactivo';
    createdAt: string;
    updatedAt: string;
  };
};
