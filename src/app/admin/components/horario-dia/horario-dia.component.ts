import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {
  LucideAngularModule,
  Plus,
  Edit,
  Trash,
  X,
  Clock,
  Search,
  Filter,
} from 'lucide-angular';

import { DiaHorarioTable } from '../../../interfaces/horarios';
import { HorarioDiasService } from '../../../services/horario-dias/horario-dias.service';

const HORARIO_VACIO: DiaHorarioTable = {
  id: 0,
  dia: '',
  hora_inicio: '',
  hora_fin: '',
};

@Component({
  selector: 'app-horario-dia',
  templateUrl: './horario-dia.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    ToastModule,
    Toolbar,
    CardModule,
    ButtonModule,
    LucideAngularModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class HorarioDiaComponent implements OnInit {
  readonly PlusIcon = Plus;
  readonly EditIcon = Edit;
  readonly TrashIcon = Trash;
  readonly XIcon = X;
  readonly ClockIcon = Clock;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;

  horarios: DiaHorarioTable[] = [];
  horariosFiltrados: DiaHorarioTable[] = [];
  horarioActual: DiaHorarioTable = { ...HORARIO_VACIO };
  horarioDialog = false;
  isEdit = false;
  submitted = false;
  first = 0;
  rows = 10;

  // Filtros
  searchTerm = '';

  constructor(
    private horariosService: HorarioDiasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.obtenerHorarios();
  }

  obtenerHorarios(): void {
    this.horariosService.getDiasHorarios().subscribe({
      next: (data) => {
        console.log('Horarios obtenidos:', data);
        this.horarios = data;
        this.aplicarFiltros();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los horarios',
        });
      },
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.horarios];
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      filtrados = filtrados.filter((h) =>
        h.dia.toLowerCase().includes(termino)
      );
    }
    this.horariosFiltrados = filtrados;
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

  editHorario(horario: DiaHorarioTable) {
    this.horarioActual = { ...horario };
    this.isEdit = true;
    this.horarioDialog = true;
  }

  deleteHorario(horario: DiaHorarioTable) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar el horario de "${horario.dia}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.horariosService.deleteDiaHorario(horario.id).subscribe({
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
    if (
      this.horarioActual.dia &&
      this.horarioActual.hora_inicio &&
      this.horarioActual.hora_fin
    ) {
      if (this.isEdit && this.horarioActual.id) {
        this.horariosService
          .updateDiaHorario(this.horarioActual.id, this.horarioActual)
          .subscribe({
            next: (horario: DiaHorarioTable) => {
              const idx = this.horarios.findIndex((h) => h.id === horario.id);
              if (idx > -1) this.horarios[idx] = horario;
              this.aplicarFiltros();
              this.hideDialog();
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Horario actualizado correctamente',
                life: 3000,
              });
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
        this.horariosService.createDiaHorario(this.horarioActual).subscribe({
          next: (horario: DiaHorarioTable) => {
            this.horarios.push(horario);
            this.aplicarFiltros();
            this.hideDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Creado',
              detail: 'Horario creado correctamente',
              life: 3000,
            });
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
