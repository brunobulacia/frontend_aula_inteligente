import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorariosService } from '../../../services/horarios/horarios.service';
import { Horarios } from '../../../interfaces/horarios';
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
  Clock,
} from 'lucide-angular';

const HORARIO_VACIO: Horarios = {
  id: 0,
  hora_inicio: '',
  hora_fin: '',
};

@Component({
  selector: 'app-horarios',
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
  templateUrl: './horarios.component.html',
  standalone: true,
})
export class HorariosComponent {
  readonly TrashIcon = Trash;
  readonly EditIcon = Edit;
  readonly PlusIcon = Plus;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly RotateCcwIcon = RotateCcw;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly XIcon = X;
  readonly ClockIcon = Clock;

  horarios: Horarios[] = [];
  horariosFiltrados: Horarios[] = [];
  horarioActual: Horarios = { ...HORARIO_VACIO };
  horarioDialog = false;
  submitted = false;
  first = 0;
  rows = 10;
  isEdit = false;

  // Filtros
  searchTerm = '';

  constructor(
    private horariosService: HorariosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerHorarios();
  }

  obtenerHorarios(): void {
    this.horariosService.getHorarios().subscribe({
      next: (data) => {
        this.horarios = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener horarios', err),
    });
  }

  aplicarFiltros(): void {
    let horariosFiltrados = [...this.horarios];
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      horariosFiltrados = horariosFiltrados.filter(
        (horario) =>
          horario.hora_inicio.toLowerCase().includes(termino) ||
          horario.hora_fin.toLowerCase().includes(termino)
      );
    }
    this.horariosFiltrados = horariosFiltrados;
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
    return this.horariosFiltrados
      ? this.first + this.rows >= this.horariosFiltrados.length
      : true;
  }

  isFirstPage(): boolean {
    return this.horariosFiltrados ? this.first === 0 : true;
  }

  openNew() {
    this.horarioActual = { ...HORARIO_VACIO };
    this.submitted = false;
    this.isEdit = false;
    this.horarioDialog = true;
  }

  editHorario(horario: Horarios) {
    this.horarioActual = { ...horario };
    this.isEdit = true;
    this.horarioDialog = true;
  }

  deleteHorario(horario: Horarios) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar el horario ${horario.hora_inicio} - ${horario.hora_fin}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.horariosService.deleteHorario(horario.id).subscribe({
          next: () => {
            this.horarios = this.horarios.filter((h) => h.id !== horario.id);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Horario eliminado correctamente',
              life: 3000,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el horario',
              life: 3000,
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.horarioDialog = false;
    this.submitted = false;
  }

  saveHorario() {
    this.submitted = true;
    if (this.horarioActual.hora_inicio && this.horarioActual.hora_fin) {
      if (this.isEdit && this.horarioActual.id) {
        this.horariosService
          .updateHorario(this.horarioActual.id, this.horarioActual)
          .subscribe({
            next: (horario) => {
              const idx = this.horarios.findIndex((h) => h.id === horario.id);
              if (idx > -1) this.horarios[idx] = horario;
              this.aplicarFiltros();
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Horario actualizado correctamente',
                life: 3000,
              });
              this.horarioDialog = false;
              this.horarioActual = { ...HORARIO_VACIO };
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el horario',
                life: 3000,
              });
            },
          });
      } else {
        this.horariosService.createHorario(this.horarioActual).subscribe({
          next: (horario) => {
            this.horarios.push(horario);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Registrado',
              detail: 'Horario creado correctamente',
              life: 3000,
            });
            this.horarioDialog = false;
            this.horarioActual = { ...HORARIO_VACIO };
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear el horario',
              life: 3000,
            });
          },
        });
      }
    }
  }
}
