import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Registro } from '../../interfaces/registro';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styles: ``,
})
export class RegistroComponent {
  formulario!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      tipo_usuario: new FormControl('', Validators.required),
      ciudad: new FormControl('', Validators.required),
      zona: new FormControl('', Validators.required),
      calle: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      referencia: new FormControl('', Validators.required),
    });
  }

  get nombre() {
    return this.formulario.get('nombre')!;
  }
  get apellidos() {
    return this.formulario.get('apellidos')!;
  }
  get email() {
    return this.formulario.get('email')!;
  }
  get password() {
    return this.formulario.get('password')!;
  }
  get tipo_usuario() {
    return this.formulario.get('tipo_usuario')!;
  }
  get ciudad() {
    return this.formulario.get('ciudad')!;
  }
  get zona() {
    return this.formulario.get('zona')!;
  }
  get calle() {
    return this.formulario.get('calle')!;
  }
  get numero() {
    return this.formulario.get('numero')!;
  }
  get referencia() {
    return this.formulario.get('referencia')!;
  }

  registrar() {
    if (this.formulario.invalid) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos correctamente.',
      });
      return;
    }
    const registro: Registro = {
      nombre: this.formulario.value.nombre,
      apellidos: this.formulario.value.apellidos,
      email: this.formulario.value.email,
      password: this.formulario.value.password,
      tipo_usuario: this.formulario.value.tipo_usuario, // 👈 así está bien
      direccion: {
        ciudad: this.formulario.value.ciudad,
        zona: this.formulario.value.zona,
        calle: this.formulario.value.calle,
        numero: Number(this.formulario.value.numero), // 👈 forzado a número
        referencia: this.formulario.value.referencia,
      },
    };

    this.authService.registrar(registro).subscribe({
      next: (response) => {
        swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Registro exitoso.',
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log('❌ Error completo del backend:', error); // 👈 agrega esto
        console.log('📦 Detalle del error:', error.error);
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message || 'Error al registrar usuario.',
        });
      },
    });
  }
}
