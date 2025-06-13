import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  Horarios,
  DiaHorarioAPI,
  DIAS,
  DiaHorarioTable,
} from '../../interfaces/horarios';

@Injectable({
  providedIn: 'root',
})
export class HorariosService {
  constructor(private http: HttpClient) {}

  token = localStorage.getItem('token');

  getHorarios(): Observable<Horarios[]> {
    return this.http.get<Horarios[]>(`${environment.api}materias/horarios/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  getHorario(id: number): Observable<Horarios> {
    return this.http.get<Horarios>(
      `${environment.api}materias/horarios/${id}/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  createHorario(horario: Horarios): Observable<Horarios> {
    return this.http.post<Horarios>(
      `${environment.api}materias/horarios/`,
      horario,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  updateHorario(id: number, horario: Horarios): Observable<Horarios> {
    return this.http.put<Horarios>(
      `${environment.api}materias/horarios/${id}/`,
      horario,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  deleteHorario(id: number): Observable<any> {
    return this.http.delete(`${environment.api}materias/horarios/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  // Obtener los días de la semana
  getDias(): { id: number; nombre: string }[] {
    return DIAS;
  }

  //CRUD PARA EL INTERFACE DE DiaHorario
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
