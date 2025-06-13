import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorariosService } from '../../../services/horarios/horarios.service';
import { DiaHorarioTable } from '../../../interfaces/horarios';
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

const DIA_HORARIO_VACIO: DiaHorarioTable = {
  id: 0,
  dia: '',
  hora_inicio: '',
  hora_fin: '',
};

@Component({
  selector: 'app-dia-horario',
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
  templateUrl: './horario-dia.component.html',
  standalone: true,
})
export class HorarioDiaComponent {
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

  diasHorarios: DiaHorarioTable[] = [];
  diasHorariosFiltrados: DiaHorarioTable[] = [];
  diaHorarioActual: DiaHorarioTable = { ...DIA_HORARIO_VACIO };
  diaHorarioDialog = false;
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
    this.obtenerDiasHorarios();
  }

  obtenerDiasHorarios(): void {
    this.horariosService.getDiasHorarios().subscribe({
      next: (diasHorarios) => {
        console.log('Días-Horarios obtenidos:', diasHorarios);
      },
      error: (error) => {
        console.error('Error al obtener los días-horarios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los días-horarios',
          life: 3000,
        });
      },
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.diasHorarios];
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      filtrados = filtrados.filter(
        (dh) =>
          dh.dia.toLowerCase().includes(termino) ||
          dh.hora_inicio.toLowerCase().includes(termino) ||
          dh.hora_fin.toLowerCase().includes(termino)
      );
    }
    this.diasHorariosFiltrados = filtrados;
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
    return this.diasHorariosFiltrados
      ? this.first + this.rows >= this.diasHorariosFiltrados.length
      : true;
  }

  isFirstPage(): boolean {
    return this.diasHorariosFiltrados ? this.first === 0 : true;
  }

  openNew() {
    this.diaHorarioActual = { ...DIA_HORARIO_VACIO };
    this.submitted = false;
    this.isEdit = false;
    this.diaHorarioDialog = true;
  }

  editDiaHorario(dh: DiaHorarioTable) {
    this.diaHorarioActual = { ...dh };
    this.isEdit = true;
    this.diaHorarioDialog = true;
  }

  deleteDiaHorario(dh: DiaHorarioTable) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar el día-horario "${dh.dia} ${dh.hora_inicio} - ${dh.hora_fin}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.horariosService.deleteDiaHorario(dh.id).subscribe({
          next: () => {
            this.diasHorarios = this.diasHorarios.filter((d) => d.id !== dh.id);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Día-Horario eliminado correctamente',
              life: 3000,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el día-horario',
              life: 3000,
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.diaHorarioDialog = false;
    this.submitted = false;
  }

  saveDiaHorario() {
    this.submitted = true;
    if (
      this.diaHorarioActual.dia &&
      this.diaHorarioActual.hora_inicio &&
      this.diaHorarioActual.hora_fin
    ) {
      if (this.isEdit && this.diaHorarioActual.id) {
        this.horariosService
          .updateDiaHorario(this.diaHorarioActual.id, this.diaHorarioActual)
          .subscribe({
            next: (dh) => {
              const idx = this.diasHorarios.findIndex((d) => d.id === dh.id);
              if (idx > -1) this.diasHorarios[idx] = dh;
              this.aplicarFiltros();
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Día-Horario actualizado correctamente',
                life: 3000,
              });
              this.diaHorarioDialog = false;
              this.diaHorarioActual = { ...DIA_HORARIO_VACIO };
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el día-horario',
                life: 3000,
              });
            },
          });
      } else {
        this.horariosService.createDiaHorario(this.diaHorarioActual).subscribe({
          next: (dh) => {
            this.diasHorarios.push(dh);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Registrado',
              detail: 'Día-Horario creado correctamente',
              life: 3000,
            });
            this.diaHorarioDialog = false;
            this.diaHorarioActual = { ...DIA_HORARIO_VACIO };
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear el día-horario',
              life: 3000,
            });
          },
        });
      }
    }
  }
}
