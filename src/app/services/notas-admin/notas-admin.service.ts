import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { NotasAdmin } from '../../interfaces/notas';

@Injectable({
  providedIn: 'root',
})
export class NotasAdminService {
  constructor(private http: HttpClient) {}

  token = localStorage.getItem('token');

  getNotas(): Observable<NotasAdmin[]> {
    return this.http.get<NotasAdmin[]>(`${environment.api}alumnos/notas/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  getNota(id: number): Observable<NotasAdmin> {
    return this.http.get<NotasAdmin>(`${environment.api}alumnos/notas/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  createNota(nota: NotasAdmin): Observable<NotasAdmin> {
    return this.http.post<NotasAdmin>(
      `${environment.api}alumnos/notas/`,
      nota,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  updateNota(id: number, nota: NotasAdmin): Observable<NotasAdmin> {
    return this.http.put<NotasAdmin>(
      `${environment.api}notas/notas/${id}/`,
      nota,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  deleteNota(id: number): Observable<any> {
    return this.http.delete(`${environment.api}alumnos/notas/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }
}
