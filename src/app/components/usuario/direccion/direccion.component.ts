import { Component } from '@angular/core';
import { Direccion } from '../../../interfaces/direccion';
import { AuthService } from '../../../services/auth/auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'app-direccion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ListboxModule,
  ],
  templateUrl: './direccion.component.html',
  styles: ``,
})
export class DireccionComponent {
  constructor(private authService: AuthService) {}

  direccion: Partial<Direccion> = {
    id: 0,
    ciudad: '',
    zona: '',
    calle: '',
    numero: 0,
    referencia: '',
  };

  ngOnInit(): void {
    this.direccion = this.authService.getProfile().direccion;
  }
}
