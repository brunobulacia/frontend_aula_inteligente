import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionCursoService } from '../../../services/gestion-curso/gestion-curso.service';
import { GestionesService } from '../../../services/gestiones/gestiones.service';
import { CursosService } from '../../../services/cursos/cursos.service';
import { GestionCurso } from '../../../interfaces/gestion-curso';
import { Gestiones } from '../../../interfaces/gestiones';
import { Cursos } from '../../../interfaces/cursos';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { Toolbar } from 'primeng/toolbar';
import {
  LucideAngularModule,
  Trash,
  Edit,
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  Filter,
  X,
  BookOpen,
  Calendar,
} from 'lucide-angular';

const GESTION_CURSO_VACIO = {
  id: 0,
  gestion_periodo: '',
  curso_nombre: '',
};

@Component({
  selector: 'app-gestion-curso',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    ToastModule,
    CardModule,
    DividerModule,
    DropdownModule,
    Toolbar, // Agregado para p-toolbar
    LucideAngularModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './gestion-curso.component.html',
  standalone: true,
  styles: '',
})
export class GestionCursoComponent {
  readonly TrashIcon = Trash;
  readonly EditIcon = Edit;
  readonly PlusIcon = Plus;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly RotateCcwIcon = RotateCcw;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly XIcon = X;
  readonly BookOpenIcon = BookOpen;
  readonly CalendarIcon = Calendar;

  gestionCursos: GestionCurso[] = [];
  gestionCursosFiltrados: GestionCurso[] = [];
  gestionCursoActual: any = { ...GESTION_CURSO_VACIO };
  gestionCursoDialog = false;
  submitted = false;
  first = 0;
  rows = 10;
  isEdit = false;

  // Filtros
  searchTerm = '';

  // Para selects
  gestiones: Gestiones[] = [];
  cursos: Cursos[] = [];
  selectedGestionId: number | null = null;
  selectedCursoId: number | null = null;

  constructor(
    private gestionCursoService: GestionCursoService,
    private gestionesService: GestionesService,
    private cursosService: CursosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerGestionCursos();
    this.cargarGestiones();
    this.cargarCursos();
  }

  obtenerGestionCursos(): void {
    this.gestionCursoService.getGestionCursos().subscribe({
      next: (data) => {
        this.gestionCursos = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener gestion-curso', err),
    });
  }

  cargarGestiones(): void {
    this.gestionesService.getGestiones().subscribe({
      next: (data) => (this.gestiones = data),
      error: (err) => console.error('Error al obtener gestiones', err),
    });
  }

  cargarCursos(): void {
    this.cursosService.getCursos().subscribe({
      next: (data) => (this.cursos = data),
      error: (err) => console.error('Error al obtener cursos', err),
    });
  }

  aplicarFiltros(): void {
    let gestionCursosFiltrados = [...this.gestionCursos];
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      gestionCursosFiltrados = gestionCursosFiltrados.filter(
        (item) =>
          item.gestion_periodo.toLowerCase().includes(termino) ||
          item.curso_nombre.toLowerCase().includes(termino)
      );
    }
    this.gestionCursosFiltrados = gestionCursosFiltrados;
    this.first = 0;
  }

  onSearchChange(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.aplicarFiltros();
    this.messageService.add({
      severity: 'info',
      summary: 'Filtros limpiados',
      detail: 'Se han eliminado todos los filtros',
      life: 2000,
    });
  }

  get hayFiltrosActivos(): boolean {
    return this.searchTerm.trim() !== '';
  }

  get contadorFiltros(): number {
    return this.searchTerm.trim() !== '' ? 1 : 0;
  }

  next(): void {
    this.first = this.first + this.rows;
  }

  prev(): void {
    this.first = this.first - this.rows;
  }

  reset(): void {
    this.first = 0;
  }

  pageChange(event: { first: number; rows: number }): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.gestionCursosFiltrados
      ? this.first + this.rows >= this.gestionCursosFiltrados.length
      : true;
  }

  isFirstPage(): boolean {
    return this.gestionCursosFiltrados ? this.first === 0 : true;
  }

  openNew() {
    this.gestionCursoActual = { ...GESTION_CURSO_VACIO };
    this.selectedGestionId = null;
    this.selectedCursoId = null;
    this.submitted = false;
    this.isEdit = false;
    this.gestionCursoDialog = true;
  }

  editGestionCurso(gestionCurso: GestionCurso) {
    this.gestionCursoActual = { ...gestionCurso };
    // Buscar los ids a partir de los nombres
    const gestion = this.gestiones.find(
      (g) => g.periodo === gestionCurso.gestion_periodo
    );
    const curso = this.cursos.find(
      (c) => c.nombre === gestionCurso.curso_nombre
    );
    this.selectedGestionId = gestion ? gestion.id : null;
    this.selectedCursoId = curso ? curso.id : null;
    this.isEdit = true;
    this.gestionCursoDialog = true;
  }

  deleteGestionCurso(gestionCurso: GestionCurso) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar la relación "${gestionCurso.gestion_periodo} - ${gestionCurso.curso_nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.gestionCursoService.deleteGestionCurso(gestionCurso.id).subscribe({
          next: () => {
            this.gestionCursos = this.gestionCursos.filter(
              (g) => g.id !== gestionCurso.id
            );
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Relación eliminada correctamente',
              life: 3000,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la relación',
              life: 3000,
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.gestionCursoDialog = false;
    this.submitted = false;
  }

  saveGestionCurso() {
    this.submitted = true;
    if (this.selectedGestionId && this.selectedCursoId) {
      // Buscar los nombres para mostrar en la tabla
      const gestion = this.gestiones.find(
        (g) => g.id === this.selectedGestionId
      );
      const curso = this.cursos.find((c) => c.id === this.selectedCursoId);
      const payload = {
        id: this.gestionCursoActual.id,
        gestion_periodo: gestion ? gestion.periodo : '',
        curso_nombre: curso ? curso.nombre : '',
      };
      if (this.isEdit && this.gestionCursoActual.id) {
        this.gestionCursoService
          .updateGestionCurso(this.gestionCursoActual.id, payload)
          .subscribe({
            next: (res) => {
              const idx = this.gestionCursos.findIndex((g) => g.id === res.id);
              if (idx > -1) this.gestionCursos[idx] = res;
              this.aplicarFiltros();
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Relación actualizada correctamente',
                life: 3000,
              });
              this.gestionCursoDialog = false;
              this.gestionCursoActual = { ...GESTION_CURSO_VACIO };
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar la relación',
                life: 3000,
              });
            },
          });
      } else {
        this.gestionCursoService.createGestionCurso(payload).subscribe({
          next: (res) => {
            this.gestionCursos.push(res);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Registrado',
              detail: 'Relación creada correctamente',
              life: 3000,
            });
            this.gestionCursoDialog = false;
            this.gestionCursoActual = { ...GESTION_CURSO_VACIO };
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear la relación',
              life: 3000,
            });
          },
        });
      }
    }
  }
}
