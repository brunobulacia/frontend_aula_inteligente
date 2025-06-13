import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { NgIf } from '@angular/common';
import { Usuario } from '../../../interfaces/usuario';
import { Direccion } from '../../../interfaces/direccion';
import { DireccionComponent } from '../direccion/direccion.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-perfil',
  imports: [NgIf, DireccionComponent, ButtonModule],
  templateUrl: './perfil.component.html',
  styles: ``,
})
export class PerfilComponent {
  direccion: Direccion = {
    id: 0,
    ciudad: '',
    zona: '',
    calle: '',
    numero: 0,
    referencia: '',
  };
  perfil: Usuario = {
    id: 0,
    nombre: '',
    apellidos: '',
    ci: '',
    email: '',
    password: '',
    tipo_usuario: '',
    direccion: this.direccion,
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.perfil = this.authService.getProfile();
  }

  getUserRole(): string {
    switch (this.perfil?.tipo_usuario) {
      case 'admin':
        return 'Administrador';
      case 'prof':
        return 'Profesor';
      case 'alum':
        return 'Alumno';
      default:
        return 'Usuario';
    }
  }
}
