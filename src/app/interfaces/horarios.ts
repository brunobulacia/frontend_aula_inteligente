export interface Horarios {
  id: number;
  hora_inicio: string;
  hora_fin: string;
}

export interface DiaHorarioAPI {
  id: number;
  dia: number;
  horario: number;
}

export interface DiaHorarioTable {
  id: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

export const DIAS = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
];
