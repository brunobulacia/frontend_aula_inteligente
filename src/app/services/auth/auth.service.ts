import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../../interfaces/login';
import { Registro } from '../../interfaces/registro';
import { environment } from '../../../environments/environment.development';
import { Usuario } from '../../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(modelo: Login): Observable<any> {
    return this.http.post(`${environment.api}usuarios/login/`, modelo);
  }

  registrar(modelo: Registro): Observable<any> {
    return this.http.post(`${environment.api}usuarios/register/`, modelo);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setProfile(profile: Usuario): void {
    localStorage.setItem('profile', JSON.stringify(profile));
  }

  getProfile(): Usuario {
    let profile = localStorage.getItem('profile');
    return JSON.parse(profile || '{}');
  }
}
