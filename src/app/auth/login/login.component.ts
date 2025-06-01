// login.component.ts
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  formulario!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  get email() {
    return this.formulario.get('email')!;
  }
  get password() {
    return this.formulario.get('password')!;
  }

  login() {
    if (this.formulario.invalid) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos correctamente.',
      });
      return;
    }

    console.log('Formulario enviado:', this.formulario.value);

    this.authService.login(this.formulario.value).subscribe({
      next: (response) => {
        swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Inicio de sesión exitoso.',
        });
        this.authService.setToken(response.token);
        this.router.navigate(['/']);
      },
      error: (error) => {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message || 'Error al iniciar sesión.',
        });
        this.formulario.reset();
        this.router.navigate(['/login']);
      },
    });
  }
}
