import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { GestionCurso } from '../../interfaces/gestion-curso';

@Injectable({
  providedIn: 'root',
})
export class GestionCursoService {
  constructor(private http: HttpClient) {}

  token = localStorage.getItem('token');

  getGestionCursos(): Observable<GestionCurso[]> {
    return this.http.get<GestionCurso[]>(
      `${environment.api}materias/gestion-curso/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  getGestionCurso(id: number): Observable<GestionCurso> {
    return this.http.get<GestionCurso>(
      `${environment.api}materias/gestion-curso/${id}/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  createGestionCurso(gestionCurso: GestionCurso): Observable<GestionCurso> {
    return this.http.post<GestionCurso>(
      `${environment.api}materias/gestion-curso/`,
      gestionCurso,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  updateGestionCurso(
    id: number,
    gestionCurso: GestionCurso
  ): Observable<GestionCurso> {
    return this.http.put<GestionCurso>(
      `${environment.api}materias/gestion-curso/${id}/`,
      gestionCurso,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  deleteGestionCurso(id: number): Observable<any> {
    return this.http.delete(`${environment.api}materias/gestion-curso/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }
}
