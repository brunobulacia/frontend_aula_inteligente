import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Direccion } from '../../interfaces/direccion';

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  getDirecciones(): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(
      `${environment.api}usuarios/direcciones/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  getDireccion(id: number): Observable<Direccion> {
    return this.http.get<Direccion>(
      `${environment.api}usuarios/direcciones/${id}/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  createDireccion(direccion: Direccion): Observable<Direccion> {
    return this.http.post<Direccion>(
      `${environment.api}usuarios/direcciones/`,
      direccion,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  updateDireccion(id: number, direccion: Direccion): Observable<Direccion> {
    return this.http.put<Direccion>(
      `${environment.api}usuarios/direcciones/${id}/`,
      direccion,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  deleteDireccion(id: number): Observable<any> {
    return this.http.delete(`${environment.api}usuarios/direcciones/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }
}
