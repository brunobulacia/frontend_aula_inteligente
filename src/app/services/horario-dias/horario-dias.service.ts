import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { DiaHorarioTable } from '../../interfaces/horarios';

@Injectable({
  providedIn: 'root',
})
export class HorarioDiasService {
  constructor(private http: HttpClient) {}

  token = localStorage.getItem('token');

  getDiasHorarios(): Observable<DiaHorarioTable[]> {
    return this.http.get<DiaHorarioTable[]>(
      `${environment.api}materias/dia-horarios/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  getDiaHorario(id: number): Observable<DiaHorarioTable> {
    return this.http.get<DiaHorarioTable>(
      `${environment.api}materias/dia-horarios/${id}/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  createDiaHorario(diaHorario: DiaHorarioTable): Observable<DiaHorarioTable> {
    return this.http.post<DiaHorarioTable>(
      `${environment.api}materias/dia-horarios/`,
      diaHorario,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  updateDiaHorario(
    id: number,
    diaHorario: DiaHorarioTable
  ): Observable<DiaHorarioTable> {
    return this.http.put<DiaHorarioTable>(
      `${environment.api}materias/dia-horarios/${id}/`,
      diaHorario,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  deleteDiaHorario(id: number): Observable<any> {
    return this.http.delete(`${environment.api}materias/dia-horarios/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }
}
