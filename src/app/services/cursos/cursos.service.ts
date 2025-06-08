import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Cursos } from '../../interfaces/cursos';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  constructor(private http: HttpClient) {}
  token = localStorage.getItem('token');

  getCursos(): Observable<Cursos[]> {
    return this.http.get<Cursos[]>(`${environment.api}materias/cursos/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  getCurso(id: number): Observable<Cursos> {
    return this.http.get<Cursos>(`${environment.api}materias/cursos/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  createCurso(curso: Cursos): Observable<Cursos> {
    return this.http.post<Cursos>(`${environment.api}materias/cursos/`, curso, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  updateCurso(id: number, curso: Cursos): Observable<Cursos> {
    return this.http.put<Cursos>(
      `${environment.api}materias/cursos/${id}/`,
      curso,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  deleteCurso(id: number): Observable<any> {
    return this.http.delete(`${environment.api}materias/cursos/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }
}
