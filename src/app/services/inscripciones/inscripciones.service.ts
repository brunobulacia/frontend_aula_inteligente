import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { InscripcionAPI } from '../../interfaces/inscripciones';

@Injectable({
  providedIn: 'root',
})
export class InscripcionesService {
  constructor(private http: HttpClient) {}
  token = localStorage.getItem('token');

  inscribirAlumno(payload: InscripcionAPI): Observable<InscripcionAPI> {
    const headers = { Authorization: `Token ${this.token}` };
    return this.http.post<InscripcionAPI>(
      `${environment.api}alumnos/fichas/inscribir-alumno/`,
      payload,
      { headers }
    );
  }
}
