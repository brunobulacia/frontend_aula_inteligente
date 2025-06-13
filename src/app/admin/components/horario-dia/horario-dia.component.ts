import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorariosService } from '../../../services/horarios/horarios.service';
import {
  DiaHorarioAPI,
  DiaHorarioTable,
  Horarios,
} from '../../../interfaces/horarios';
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
  CalendarClock,
} from 'lucide-angular';

const DIA_HORARIO_VACIO: DiaHorarioAPI = {
  id: 0,
  dia: 0,
  horario: 0,
};

// Nueva interfaz para la vista de la tabla
interface DiaHorarioView {
  id: number;
  dia: number;
  dia_nombre: string;
  horario: number;
  horario_inicio: string;
  horario_fin: string;
}

@Component({
  selector: 'app-horario-dia',
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
    LucideAngularModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './horario-dia.component.html',
  standalone: true,
  styles: '',
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

  diasHorarios: DiaHorarioAPI[] = [];
  diasHorariosTable: DiaHorarioTable[] = [];
  diasHorariosFiltrados: DiaHorarioTable[] = [];
  diaHorarioActual: DiaHorarioAPI = { id: 0, dia: 0, horario: 0 };
  diaHorarioDialog = false;
  submitted = false;
  first = 0;
  rows = 10;
  isEdit = false;

  // Filtros
  searchTerm = '';

  // Para selects
  dias: { id: number; nombre: string }[] = [];
  horarios: Horarios[] = [];
  selectedDia: number | null = null;
  selectedHorario: number | null = null;
  selectedHorarioFin: Horarios | null = null;

  constructor(
    private horariosService: HorariosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerDiasHorarios();
    this.cargarDias();
    this.cargarHorarios();
  }

  obtenerDiasHorarios(): void {
    this.horariosService.getDiasHorarios().subscribe({
      next: (data) => {
        this.diasHorarios = data;
        this.diasHorariosTable = this.mapDiaHorarioToTable(data);
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener dia-horarios', err),
    });
  }

  mapDiaHorarioToTable(data: DiaHorarioAPI[]): DiaHorarioTable[] {
    return data.map((item) => {
      const diaObj = this.dias.find((d) => d.id === item.dia);
      const horarioObj = this.horarios.find((h) => h.id === item.horario);
      return {
        id: item.id,
        dia_nombre: diaObj ? diaObj.nombre : '',
        horario_inicio: horarioObj ? horarioObj.hora_inicio : '',
        horario_fin: horarioObj ? horarioObj.hora_fin : '',
      };
    });
  }

  cargarDias(): void {
    this.dias = this.horariosService.getDias();
  }

  cargarHorarios(): void {
    this.horariosService.getHorarios().subscribe({
      next: (data) => {
        this.horarios = data;
        // Actualizar la vista si ya hay datos cargados
        if (this.diasHorarios.length > 0) {
          this.diasHorariosTable = this.mapDiaHorarioToTable(this.diasHorarios);
          this.aplicarFiltros();
        }
      },
      error: (err) => console.error('Error al obtener horarios', err),
    });
  }

  aplicarFiltros(): void {
    let diasHorariosFiltrados = [...this.diasHorariosTable];
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      diasHorariosFiltrados = diasHorariosFiltrados.filter(
        (item) =>
          item.dia_nombre.toLowerCase().includes(termino) ||
          item.horario_inicio.toLowerCase().includes(termino) ||
          item.horario_fin.toLowerCase().includes(termino)
      );
    }
    this.diasHorariosFiltrados = diasHorariosFiltrados;
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
    this.diaHorarioActual = { id: 0, dia: 0, horario: 0 };
    this.selectedDia = null;
    this.selectedHorario = null;
    this.submitted = false;
    this.isEdit = false;
    this.diaHorarioDialog = true;
  }

  editDiaHorario(diaHorarioTable: DiaHorarioTable) {
    const api = this.diasHorarios.find((d) => d.id === diaHorarioTable.id);
    if (api) {
      this.diaHorarioActual = { ...api };
      this.selectedDia = api.dia;
      this.selectedHorario = api.horario;
    }
    this.isEdit = true;
    this.diaHorarioDialog = true;
  }

  deleteDiaHorario(diaHorarioTable: DiaHorarioTable) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar el horario del día "${diaHorarioTable.dia_nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.horariosService.deleteDiaHorario(diaHorarioTable.id).subscribe({
          next: () => {
            this.obtenerDiasHorarios();
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
    this.diaHorarioDialog = false;
    this.submitted = false;
  }

  saveDiaHorario() {
    this.submitted = true;
    if (this.selectedDia && this.selectedHorario) {
      const payload: DiaHorarioAPI = {
        id: this.diaHorarioActual.id,
        dia: this.selectedDia,
        horario: this.selectedHorario,
      };
      if (this.isEdit && this.diaHorarioActual.id) {
        this.horariosService
          .updateDiaHorario(this.diaHorarioActual.id, payload)
          .subscribe({
            next: () => {
              this.obtenerDiasHorarios();
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Horario actualizado correctamente',
                life: 3000,
              });
              this.diaHorarioDialog = false;
              this.diaHorarioActual = { id: 0, dia: 0, horario: 0 };
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
        this.horariosService.createDiaHorario(payload).subscribe({
          next: () => {
            this.obtenerDiasHorarios();
            this.messageService.add({
              severity: 'success',
              summary: 'Registrado',
              detail: 'Horario creado correctamente',
              life: 3000,
            });
            this.diaHorarioDialog = false;
            this.diaHorarioActual = { id: 0, dia: 0, horario: 0 };
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
