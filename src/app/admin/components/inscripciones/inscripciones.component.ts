import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InscripcionesService } from '../../../services/inscripciones/inscripciones.service';
import type {
  InscripcionAPI,
  MateriaInscripcion,
} from '../../../interfaces/inscripciones';
import { MateriasService } from '../../../services/materias/materias.service';
import type { Materias } from '../../../interfaces/materias';
import { GestionCursoService } from '../../../services/gestion-curso/gestion-curso.service';
import type { GestionCurso } from '../../../interfaces/gestion-curso';
import type { Usuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../services/usuarios/usuarios.service';
// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Lucide Angular Icons
import { LucideAngularModule } from 'lucide-angular';
import {
  User as UserIcon,
  BookOpen as BookOpenIcon,
  CalendarClock as CalendarClockIcon,
  Plus as PlusIcon,
  Trash as TrashIcon,
  Check as CheckIcon,
  X as XIcon,
  School as SchoolIcon,
  Save as SaveIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    ToastModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    LucideAngularModule,
  ],
  providers: [MessageService, UsuarioService],
  templateUrl: './inscripciones.component.html',
  styles: `
    :host ::ng-deep .p-dropdown {
      background-color: #f0f9ff;
      border-color: #bfdbfe;
      color: #1e40af;
    }
    
    :host ::ng-deep .p-dropdown-panel {
      background-color: #f0f9ff;
      border-color: #bfdbfe;
    }
    
    :host ::ng-deep .p-dropdown-item {
      color: #1e40af;
    }
    
    :host ::ng-deep .p-dropdown-item:hover {
      background-color: #dbeafe;
    }
    
    :host ::ng-deep .p-dropdown-filter {
      background-color: #f0f9ff;
      border-color: #bfdbfe;
      color: #1e40af;
    }
    
    :host ::ng-deep .p-dropdown-filter::placeholder {
      color: #60a5fa;
    }
    
    :host ::ng-deep .p-card {
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    :host ::ng-deep .p-card .p-card-content {
      padding: 0;
    }
    
    :host ::ng-deep .p-divider .p-divider-content {
      background-color: transparent;
    }
    
    :host ::ng-deep .p-button.p-button-sm {
      padding: 0.4rem 0.75rem;
    }
    
    :host ::ng-deep .p-dropdown-items-wrapper::-webkit-scrollbar {
      width: 8px;
    }
    
    :host ::ng-deep .p-dropdown-items-wrapper::-webkit-scrollbar-thumb {
      background-color: #93c5fd;
      border-radius: 4px;
    }
    
    :host ::ng-deep .p-dropdown-items-wrapper::-webkit-scrollbar-track {
      background-color: #e0f2fe;
    }
    
    :host ::ng-deep .p-button.p-button-outlined.p-button-secondary {
      color: #475569;
      border-color: #cbd5e1;
    }
    
    :host ::ng-deep .p-button.p-button-outlined.p-button-secondary:hover {
      background: #f1f5f9;
      color: #334155;
    }
  `,
})
export class InscripcionesComponent implements OnInit {
  // Lucide Icons
  UserIcon = UserIcon;
  BookOpenIcon = BookOpenIcon;
  CalendarClockIcon = CalendarClockIcon;
  PlusIcon = PlusIcon;
  TrashIcon = TrashIcon;
  CheckIcon = CheckIcon;
  XIcon = XIcon;
  SchoolIcon = SchoolIcon;
  SaveIcon = SaveIcon;

  materias: Materias[] = [];
  gestionesCurso: GestionCurso[] = [];
  usuarios: Usuario[] = [];
  inscripcion: InscripcionAPI = {
    alumno_id: 0,
    materias: [],
  };
  materiasSeleccionadas: MateriaInscripcion[] = [];
  loading = false;
  submitting = false;
  loadingUsuarios = false;

  // Add this method to your component class
  getNombreCompletoAlumno(alumnoId: number): string {
    const alumno = this.usuarios?.find((u: any) => u.id === alumnoId);
    return alumno ? `${alumno.nombre} ${alumno.apellidos}` : '';
  }

  constructor(
    private inscripcionesService: InscripcionesService,
    private materiasService: MateriasService,
    private gestionCursoService: GestionCursoService,
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarMaterias();
    this.cargarGestionesCurso();
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loadingUsuarios = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loadingUsuarios = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios',
        });
        this.loadingUsuarios = false;
      },
    });
  }

  cargarMaterias(): void {
    this.loading = true;
    this.materiasService.getMaterias().subscribe({
      next: (data) => {
        this.materias = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las materias',
        });
        this.loading = false;
      },
    });
  }

  cargarGestionesCurso(): void {
    this.loading = true;
    this.gestionCursoService.getGestionCursos().subscribe({
      next: (data) => {
        this.gestionesCurso = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las gestiones de curso',
        });
        this.loading = false;
      },
    });
  }

  agregarMateria(): void {
    this.materiasSeleccionadas.push({
      materia_id: 0,
      gestion_curso_id: 0,
    });
  }

  eliminarMateria(index: number): void {
    this.materiasSeleccionadas.splice(index, 1);
  }

  enviarInscripcion(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.submitting = true;
    this.inscripcion.materias = [...this.materiasSeleccionadas];
    console.log('Inscripción a enviar:', this.inscripcion);
    this.inscripcionesService.inscribirAlumno(this.inscripcion).subscribe({
      next: (response) => {
        console.log(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Inscripción realizada correctamente',
        });
        this.limpiarFormulario();
        this.submitting = false;
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo realizar la inscripción',
        });
        this.submitting = false;
      },
    });
  }

  validarFormulario(): boolean {
    if (!this.inscripcion.alumno_id || this.inscripcion.alumno_id <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un alumno',
      });
      return false;
    }

    if (this.materiasSeleccionadas.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar al menos una materia',
      });
      return false;
    }

    for (const materia of this.materiasSeleccionadas) {
      if (!materia.materia_id || !materia.gestion_curso_id) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Complete todos los campos de materias y gestiones',
        });
        return false;
      }
    }

    return true;
  }

  limpiarFormulario(): void {
    this.inscripcion = {
      alumno_id: 0,
      materias: [],
    };
    this.materiasSeleccionadas = [];
  }

  getNombreMateria(id: number): string {
    const materia = this.materias.find((m) => m.id === id);
    return materia ? materia.nombre : '';
  }

  getNombreGestion(id: number): string {
    const gestion = this.gestionesCurso.find((g) => g.id === id);
    return gestion
      ? `${gestion.curso_nombre} - ${gestion.gestion_periodo}`
      : '';
  }
}
