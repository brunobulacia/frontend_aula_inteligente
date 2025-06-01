import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../../interfaces/login';
import { Registro } from '../../interfaces/registro';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(modelo: Login): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/usuarios/login/', modelo);
  }

  registrar(modelo: Registro): Observable<any> {
    console.log('Registro:', modelo);

    return this.http.post('http://127.0.0.1:8000/usuarios/register/', modelo);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
}
