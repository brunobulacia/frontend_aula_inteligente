import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AsignacionesAPI } from '../../interfaces/asignaciones';

@Injectable({
  providedIn: 'root',
})
export class AsignacionesService {
  constructor(private http: HttpClient) {}

  token = localStorage.getItem('token');

  getAsignaciones(): Observable<AsignacionesAPI[]> {
    return this.http.get<AsignacionesAPI[]>(
      `${environment.api}materias/asignaciones/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  getAsignacion(id: number): Observable<AsignacionesAPI> {
    return this.http.get<AsignacionesAPI>(
      `${environment.api}materias/asignaciones/${id}/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  createAsignacion(asignacion: AsignacionesAPI): Observable<AsignacionesAPI> {
    return this.http.post<AsignacionesAPI>(
      `${environment.api}materias/asignaciones/`,
      asignacion,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  updateAsignacion(
    id: number,
    asignacion: AsignacionesAPI
  ): Observable<AsignacionesAPI> {
    return this.http.put<AsignacionesAPI>(
      `${environment.api}materias/asignaciones/${id}/`,
      asignacion,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  deleteAsignacion(id: number): Observable<any> {
    return this.http.delete(`${environment.api}materias/asignaciones/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }
}
