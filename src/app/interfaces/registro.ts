export interface Registro {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  tipo_usuario: string;
  direccion: {
    ciudad: string;
    zona: string;
    calle: string;
    numero: number;
    referencia: string;
  };
}
