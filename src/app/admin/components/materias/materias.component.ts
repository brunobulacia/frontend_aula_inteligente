import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MateriasService } from '../../../services/materias/materias.service';
import { Materias } from '../../../interfaces/materias';
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

const MATERIA_VACIA: Materias = {
  id: 0,
  nombre: '',
};

@Component({
  selector: 'app-materias',
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
  templateUrl: './materias.component.html',
  standalone: true,
})
export class MateriasComponent {
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

  materias: Materias[] = [];
  materiasFiltradas: Materias[] = [];
  materiaActual: Materias = { ...MATERIA_VACIA };
  materiaDialog = false;
  submitted = false;
  first = 0;
  rows = 10;
  isEdit = false;

  // Filtros
  searchTerm = '';

  constructor(
    private materiasService: MateriasService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerMaterias();
  }

  obtenerMaterias(): void {
    this.materiasService.getMaterias().subscribe({
      next: (data) => {
        this.materias = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener materias', err),
    });
  }

  aplicarFiltros(): void {
    let materiasFiltradas = [...this.materias];
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      materiasFiltradas = materiasFiltradas.filter((materia) =>
        materia.nombre.toLowerCase().includes(termino)
      );
    }
    this.materiasFiltradas = materiasFiltradas;
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
    return this.materiasFiltradas
      ? this.first + this.rows >= this.materiasFiltradas.length
      : true;
  }

  isFirstPage(): boolean {
    return this.materiasFiltradas ? this.first === 0 : true;
  }

  openNew() {
    this.materiaActual = { ...MATERIA_VACIA };
    this.submitted = false;
    this.isEdit = false;
    this.materiaDialog = true;
  }

  editMateria(materia: Materias) {
    this.materiaActual = { ...materia };
    this.isEdit = true;
    this.materiaDialog = true;
  }

  deleteMateria(materia: Materias) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar la materia "${materia.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.materiasService.deleteMateria(materia.id).subscribe({
          next: () => {
            this.materias = this.materias.filter((m) => m.id !== materia.id);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Materia eliminada correctamente',
              life: 3000,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la materia',
              life: 3000,
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.materiaDialog = false;
    this.submitted = false;
  }

  saveMateria() {
    this.submitted = true;
    if (this.materiaActual.nombre) {
      if (this.isEdit && this.materiaActual.id) {
        this.materiasService
          .updateMateria(this.materiaActual.id, this.materiaActual)
          .subscribe({
            next: (materia) => {
              const idx = this.materias.findIndex((m) => m.id === materia.id);
              if (idx > -1) this.materias[idx] = materia;
              this.aplicarFiltros();
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Materia actualizada correctamente',
                life: 3000,
              });
              this.materiaDialog = false;
              this.materiaActual = { ...MATERIA_VACIA };
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar la materia',
                life: 3000,
              });
            },
          });
      } else {
        this.materiasService.createMateria(this.materiaActual).subscribe({
          next: (materia) => {
            this.materias.push(materia);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Registrado',
              detail: 'Materia creada correctamente',
              life: 3000,
            });
            this.materiaDialog = false;
            this.materiaActual = { ...MATERIA_VACIA };
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear la materia',
              life: 3000,
            });
          },
        });
      }
    }
  }
}
