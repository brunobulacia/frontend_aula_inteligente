import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Gestiones } from '../../interfaces/gestiones';

@Injectable({
  providedIn: 'root',
})
export class GestionesService {
  constructor(private http: HttpClient) {}

  token = localStorage.getItem('token');
  getGestiones(): Observable<Gestiones[]> {
    return this.http.get<Gestiones[]>(`${environment.api}materias/gestiones/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  getGestion(id: number): Observable<Gestiones> {
    return this.http.get<Gestiones>(
      `${environment.api}materias/gestiones/${id}/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  createGestion(gestion: Gestiones): Observable<Gestiones> {
    return this.http.post<Gestiones>(
      `${environment.api}materias/gestiones/`,
      gestion,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  updateGestion(id: number, gestion: Gestiones): Observable<Gestiones> {
    return this.http.put<Gestiones>(
      `${environment.api}materias/gestiones/${id}/`,
      gestion,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  deleteGestion(id: number): Observable<any> {
    return this.http.delete(`${environment.api}materias/gestiones/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }
}
