// materias.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfesorService } from '../../../services/profesor/profesor.service';
import { LucideAngularModule } from 'lucide-angular';
import { BookIcon, CalendarIcon, UserIcon, ClockIcon } from 'lucide-angular';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProfesorMaterias } from '../../../interfaces/profesorMaterias';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    TableModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    ToastModule,
    RouterLink,
  ],
  providers: [MessageService],
  templateUrl: './materias.component.html',
  styles: ``,
})
export class MateriasProfComponent implements OnInit {
  materias: ProfesorMaterias[] = [];
  loading: boolean = true;
  error: string | null = null;
  // Icon references
  BookIcon = BookIcon;
  CalendarIcon = CalendarIcon;
  UserIcon = UserIcon;
  ClockIcon = ClockIcon;

  constructor(
    private profesorService: ProfesorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadMaterias();
  }

  loadMaterias(): void {
    this.loading = true;
    this.profesorService.getMateriasProfesor(1).subscribe({
      next: (data) => {
        this.materias = data;
        console.log(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'No se pudieron cargar las materias';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las materias',
        });
      },
    });
  }
}
