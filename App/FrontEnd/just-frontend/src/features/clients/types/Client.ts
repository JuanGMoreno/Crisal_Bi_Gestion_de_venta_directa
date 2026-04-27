export interface Client {
  id_cliente: string;
  nombre: string;
  cedula: string;
  direccion?: string | null;
  edad?: number | null;
  numero_telefono?: string | null;
  foto_avatar?: string | null;
  estado: string;
}
