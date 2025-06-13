export interface ProfesorMaterias {
  id: number;
  materia_nombre: string;
  curso_nombre: string;
  profesor_nombre: string;
  gestion_periodo: string;
  dia_horarios: {
    id: number;
    dia: string;
    hora_inicio: string;
    hora_fin: string;
  }[];
  materia: number;
  gestion_curso: number;
  profesor: number;
}

export interface AlumnoXMateria {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  ci: string;
  tipo_usuario: string;
  direccion: {
    id: number;
    ciudad: string;
    zona: string;
    calle: string;
    numero: string;
    referencia: string;
  };
}

export interface Calificar {
  alumno_id: number;
  materia_id: number;
  gestion_curso: number;
  ser: number;
  saber: number;
  hacer: number;
  decidir: number;
}

export interface verParticipaciones {
  alumno: string;
  fecha: string;
  descripcion: string;
}

export interface verAsistencias {
  alumno: string;
  fecha: string;
  asistio: boolean;
}

export interface registrarAsistencia {
  alumno_id: number;
  materia_id: number;
  gestion_curso_id: number;
  fecha: string;
  asistio: boolean;
}

export interface RegistrarParticipacion {
  alumno_id: number;
  materia_id: number;
  gestion_curso_id: number;
  fecha: string;
  descripcion: string;
}
