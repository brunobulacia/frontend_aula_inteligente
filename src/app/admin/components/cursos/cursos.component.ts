import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosService } from '../../../services/cursos/cursos.service';
import { Cursos } from '../../../interfaces/cursos';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
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
} from 'lucide-angular';

const CURSO_VACIO: Cursos = {
  id: 0,
  nombre: '',
};

@Component({
  selector: 'app-cursos',
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
    Toolbar,
    CardModule,
    DividerModule,
    LucideAngularModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './cursos.component.html',
  standalone: true,
})
export class CursosComponent {
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

  cursos: Cursos[] = [];
  cursosFiltrados: Cursos[] = [];
  cursoActual: Cursos = { ...CURSO_VACIO };
  cursoDialog = false;
  submitted = false;
  first = 0;
  rows = 10;
  isEdit = false;

  // Filtros
  searchTerm = '';

  constructor(
    private cursosService: CursosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerCursos();
  }

  obtenerCursos(): void {
    this.cursosService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener cursos', err),
    });
  }

  aplicarFiltros(): void {
    let cursosFiltrados = [...this.cursos];
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      cursosFiltrados = cursosFiltrados.filter((curso) =>
        curso.nombre.toLowerCase().includes(termino)
      );
    }
    this.cursosFiltrados = cursosFiltrados;
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
    return this.cursosFiltrados
      ? this.first + this.rows >= this.cursosFiltrados.length
      : true;
  }

  isFirstPage(): boolean {
    return this.cursosFiltrados ? this.first === 0 : true;
  }

  openNew() {
    this.cursoActual = { ...CURSO_VACIO };
    this.submitted = false;
    this.isEdit = false;
    this.cursoDialog = true;
  }

  editCurso(curso: Cursos) {
    this.cursoActual = { ...curso };
    this.isEdit = true;
    this.cursoDialog = true;
  }

  deleteCurso(curso: Cursos) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar el curso "${curso.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.cursosService.deleteCurso(curso.id).subscribe({
          next: () => {
            this.cursos = this.cursos.filter((m) => m.id !== curso.id);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Curso eliminado correctamente',
              life: 3000,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el curso',
              life: 3000,
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.cursoDialog = false;
    this.submitted = false;
  }

  saveCurso() {
    this.submitted = true;
    if (this.cursoActual.nombre) {
      if (this.isEdit && this.cursoActual.id) {
        this.cursosService
          .updateCurso(this.cursoActual.id, this.cursoActual)
          .subscribe({
            next: (curso) => {
              const idx = this.cursos.findIndex((m) => m.id === curso.id);
              if (idx > -1) this.cursos[idx] = curso;
              this.aplicarFiltros();
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Curso actualizado correctamente',
                life: 3000,
              });
              this.cursoDialog = false;
              this.cursoActual = { ...CURSO_VACIO };
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el curso',
                life: 3000,
              });
            },
          });
      } else {
        this.cursosService.createCurso(this.cursoActual).subscribe({
          next: (curso) => {
            this.cursos.push(curso);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Registrado',
              detail: 'Curso creado correctamente',
              life: 3000,
            });
            this.cursoDialog = false;
            this.cursoActual = { ...CURSO_VACIO };
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear el curso',
              life: 3000,
            });
          },
        });
      }
    }
  }
}
