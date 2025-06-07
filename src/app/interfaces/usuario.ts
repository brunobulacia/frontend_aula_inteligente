export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  tipo_usuario: string;
  direccion: {
    id: number;
    ciudad: string;
    zona: string;
    calle: string;
    numero: number;
    referencia: string;
  };
}
