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

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    MessageModule,
  ],
})
export class LoginComponent {
  formulario!: FormGroup;
  isLoading = false;

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
      this.formulario.markAllAsTouched();
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos correctamente.',
      });
      return;
    }

    this.isLoading = true;
    console.log('Formulario enviado:', this.formulario.value);

    this.authService.login(this.formulario.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Inicio de sesión exitoso.',
        });

        console.log(response.user);
        this.authService.setToken(response.token);
        this.authService.setProfile(response.user);
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        this.isLoading = false;
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
