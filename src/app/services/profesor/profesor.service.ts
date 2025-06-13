import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  ProfesorMaterias,
  AlumnoXMateria,
  Calificar,
  verParticipaciones,
  verAsistencias,
  registrarAsistencia,
  RegistrarParticipacion,
} from '../../interfaces/profesorMaterias';

@Injectable({
  providedIn: 'root',
})
export class ProfesorService {
  constructor(private http: HttpClient) {}

  token = localStorage.getItem('token');

  getMateriasProfesor(gestion_id: number): Observable<ProfesorMaterias[]> {
    const headers = { Authorization: `Token ${this.token}` };
    return this.http.get<ProfesorMaterias[]>(
      `${environment.api}alumnos/profesores/mis-materias/`,
      { params: { gestion_id: gestion_id.toString() }, headers }
    );
  }

  getAlumnoXMaterias(mgcID: number): Observable<AlumnoXMateria[]> {
    console.log('mgcID:', mgcID);
    return this.http.get<AlumnoXMateria[]>(
      `${environment.api}alumnos/profesores/${mgcID}/alumnos/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  calificarAlumno(payload: Calificar): Observable<Calificar> {
    return this.http.post<Calificar>(
      `${environment.api}alumnos/profesores/calificar/`,
      payload,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  verAsistencias(
    gestion_curso_id: number,
    materia_id: number
  ): Observable<verAsistencias[]> {
    const headers = { Authorization: `Token ${this.token}` };
    return this.http.get<verAsistencias[]>(
      `${environment.api}alumnos/profesores/ver-asistencias/`,
      {
        params: {
          gestion_curso_id: gestion_curso_id.toString(),
          materia_id: materia_id.toString(),
        },
        headers,
      }
    );
  }

  verParticipaciones(
    gestion_curso_id: number,
    materia_id: number
  ): Observable<verParticipaciones[]> {
    const headers = { Authorization: `Token ${this.token}` };
    return this.http.get<verParticipaciones[]>(
      `${environment.api}alumnos/profesores/ver-participaciones/`,
      {
        params: {
          gestion_curso_id: gestion_curso_id.toString(),
          materia_id: materia_id.toString(),
        },
        headers,
      }
    );
  }

  registrarAsistencia(
    payload: registrarAsistencia
  ): Observable<registrarAsistencia> {
    return this.http.post<registrarAsistencia>(
      `${environment.api}alumnos/profesores/registrar-asistencia/`,
      payload,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  registrarParticipacion(
    payload: RegistrarParticipacion
  ): Observable<RegistrarParticipacion> {
    return this.http.post<RegistrarParticipacion>(
      `${environment.api}alumnos/profesores/registrar-participacion/`,
      payload,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }
}
