import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Materias } from '../../interfaces/materias';

@Injectable({
  providedIn: 'root',
})
export class MateriasService {
  constructor(private http: HttpClient) {}

  token = localStorage.getItem('token');

  getMaterias(): Observable<Materias[]> {
    return this.http.get<Materias[]>(`${environment.api}materias/materias/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  getMateria(id: number): Observable<Materias> {
    return this.http.get<Materias>(
      `${environment.api}materias/materias/${id}/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  createMateria(materia: Materias): Observable<Materias> {
    return this.http.post<Materias>(
      `${environment.api}materias/materias/`,
      materia,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  updateMateria(id: number, materia: Materias): Observable<Materias> {
    return this.http.put<Materias>(
      `${environment.api}materias/materias/${id}/`,
      materia,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  deleteMateria(id: number): Observable<any> {
    return this.http.delete(`${environment.api}materias/materias/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }
}
