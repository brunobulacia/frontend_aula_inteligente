export interface InscripcionAPI {
  alumno_id: number;
  materias: MateriaInscripcion[];
}

export interface MateriaInscripcion {
  materia_id: number;
  gestion_curso_id: number;
}
