import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.api}usuarios/usuarios/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(
      `${environment.api}usuarios/usuarios/${id}/`,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  getProfesores(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.api}usuarios/profesores/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(
      `${environment.api}usuarios/usuarios/`,
      usuario,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${environment.api}usuarios/usuarios/${id}/`,
      usuario,
      {
        headers: {
          Authorization: `Token ${this.token}`,
        },
      }
    );
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${environment.api}usuarios/usuarios/${id}/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    });
  }
}
