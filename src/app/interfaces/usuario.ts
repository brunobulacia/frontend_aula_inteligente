import { Direccion } from './direccion';

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  tipo_usuario: string;
  direccion: Partial<Direccion>;
}
