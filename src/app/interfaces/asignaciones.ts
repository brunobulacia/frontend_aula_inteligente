export interface AsignacionesAPI {
  id: number;
  dia_horarios: number[];
  materia: number;
  gestion_curso: number;
  profesor: number;
}

export interface AsignacionesView {
  id: number;
  materia_nombre: string;
  curso_nombre: string;
  profesor_nombre: string;
  gestion_periodo: string;
  dia_horarios: string; // Cadena de texto con los horarios formateados
}
