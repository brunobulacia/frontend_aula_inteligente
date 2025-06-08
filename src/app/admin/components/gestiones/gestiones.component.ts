import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionesService } from '../../../services/gestiones/gestiones.service';
import { Gestiones } from '../../../interfaces/gestiones';
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
  Calendar,
} from 'lucide-angular';

const GESTION_VACIA: Gestiones = {
  id: 0,
  periodo: '',
};

@Component({
  selector: 'app-gestiones',
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
  templateUrl: './gestiones.component.html',
  standalone: true,
})
export class GestionesComponent {
  readonly TrashIcon = Trash;
  readonly EditIcon = Edit;
  readonly PlusIcon = Plus;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly RotateCcwIcon = RotateCcw;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly XIcon = X;
  readonly CalendarIcon = Calendar;

  gestiones: Gestiones[] = [];
  gestionesFiltradas: Gestiones[] = [];
  gestionActual: Gestiones = { ...GESTION_VACIA };
  gestionDialog = false;
  submitted = false;
  first = 0;
  rows = 10;
  isEdit = false;

  // Filtros
  searchTerm = '';

  constructor(
    private gestionesService: GestionesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerGestiones();
  }

  obtenerGestiones(): void {
    this.gestionesService.getGestiones().subscribe({
      next: (data) => {
        this.gestiones = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener gestiones', err),
    });
  }

  aplicarFiltros(): void {
    let gestionesFiltradas = [...this.gestiones];
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      gestionesFiltradas = gestionesFiltradas.filter((gestion) =>
        gestion.periodo.toLowerCase().includes(termino)
      );
    }
    this.gestionesFiltradas = gestionesFiltradas;
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
    return this.gestionesFiltradas
      ? this.first + this.rows >= this.gestionesFiltradas.length
      : true;
  }

  isFirstPage(): boolean {
    return this.gestionesFiltradas ? this.first === 0 : true;
  }

  openNew() {
    this.gestionActual = { ...GESTION_VACIA };
    this.submitted = false;
    this.isEdit = false;
    this.gestionDialog = true;
  }

  editGestion(gestion: Gestiones) {
    this.gestionActual = { ...gestion };
    this.isEdit = true;
    this.gestionDialog = true;
  }

  deleteGestion(gestion: Gestiones) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar la gestión "${gestion.periodo}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.gestionesService.deleteGestion(gestion.id).subscribe({
          next: () => {
            this.gestiones = this.gestiones.filter((g) => g.id !== gestion.id);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Gestión eliminada correctamente',
              life: 3000,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la gestión',
              life: 3000,
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.gestionDialog = false;
    this.submitted = false;
  }

  saveGestion() {
    this.submitted = true;
    if (this.gestionActual.periodo) {
      if (this.isEdit && this.gestionActual.id) {
        this.gestionesService
          .updateGestion(this.gestionActual.id, this.gestionActual)
          .subscribe({
            next: (gestion) => {
              const idx = this.gestiones.findIndex((g) => g.id === gestion.id);
              if (idx > -1) this.gestiones[idx] = gestion;
              this.aplicarFiltros();
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Gestión actualizada correctamente',
                life: 3000,
              });
              this.gestionDialog = false;
              this.gestionActual = { ...GESTION_VACIA };
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar la gestión',
                life: 3000,
              });
            },
          });
      } else {
        this.gestionesService.createGestion(this.gestionActual).subscribe({
          next: (gestion) => {
            this.gestiones.push(gestion);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Registrado',
              detail: 'Gestión creada correctamente',
              life: 3000,
            });
            this.gestionDialog = false;
            this.gestionActual = { ...GESTION_VACIA };
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear la gestión',
              life: 3000,
            });
          },
        });
      }
    }
  }
}
