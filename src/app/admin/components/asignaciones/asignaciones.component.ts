import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionesService } from '../../../services/asignaciones/asignaciones.service';
import { HorariosService } from '../../../services/horarios/horarios.service';
import { MateriasService } from '../../../services/materias/materias.service';
import { GestionCursoService } from '../../../services/gestion-curso/gestion-curso.service';
import { CursosService } from '../../../services/cursos/cursos.service';
import { GestionesService } from '../../../services/gestiones/gestiones.service';
import { UsuarioService } from '../../../services/usuarios/usuarios.service';
import {
  AsignacionesAPI,
  AsignacionesView,
} from '../../../interfaces/asignaciones';
import {
  Horarios,
  DiaHorarioAPI,
  DiaHorarioTable,
  DIAS,
} from '../../../interfaces/horarios';
import { Materias } from '../../../interfaces/materias';
import { GestionCurso } from '../../../interfaces/gestion-curso';
import { Cursos } from '../../../interfaces/cursos';
import { Gestiones } from '../../../interfaces/gestiones';
import { Usuario } from '../../../interfaces/usuario';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
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
  CalendarClock,
} from 'lucide-angular';

const ASIGNACION_VACIA: AsignacionesAPI = {
  id: 0,
  dia_horarios: [],
  materia: 0,
  gestion_curso: 0,
  profesor: 0,
};

@Component({
  selector: 'app-asignaciones',
  standalone: true,
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
    DropdownModule,
    MultiSelectModule,
    CardModule,
    DividerModule,
    LucideAngularModule,
    Toolbar, // Agregado para p-toolbar
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './asignaciones.component.html',
})
export class AsignacionesComponent {
  readonly TrashIcon = Trash;
  readonly EditIcon = Edit;
  readonly PlusIcon = Plus;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly RotateCcwIcon = RotateCcw;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly XIcon = X;
  readonly CalendarClockIcon = CalendarClock;

  asignaciones: AsignacionesView[] = [];
  asignacionesFiltradas: AsignacionesView[] = [];
  asignacionActual: AsignacionesAPI = { ...ASIGNACION_VACIA };
  asignacionDialog = false;
  submitted = false;
  first = 0;
  rows = 10;
  isEdit = false;

  // Filtros
  searchTerm = '';

  // Selects
  materias: Materias[] = [];
  gestionCursos: any[] = [];
  profesores: Usuario[] = [];
  horarios: Horarios[] = [];
  cursos: Cursos[] = [];
  gestiones: Gestiones[] = [];
  diasHorarios: DiaHorarioAPI[] = [];
  diasHorariosTable: DiaHorarioTable[] = [];
  diasHorariosOptions: { label: string; value: number }[] = [];

  // Para selects del dialog
  selectedMateria = 0;
  selectedGestionCurso = 0;
  selectedProfesor = 0;
  selectedDiaHorarios: number[] = [];

  constructor(
    private asignacionesService: AsignacionesService,
    private horariosService: HorariosService,
    private materiasService: MateriasService,
    private gestionCursoService: GestionCursoService,
    private cursosService: CursosService,
    private gestionesService: GestionesService,
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.obtenerMaterias();
    this.obtenerGestionCursos();
    // this.obtenerHorarios();
    // this.obtenerDiasHorarios();
    this.obtenerCursos();
    this.obtenerGestiones();
    this.obtenerProfesores();
    this.obtenerAsignaciones();
  }

  obtenerMaterias() {
    this.materiasService.getMaterias().subscribe({
      next: (data) => (this.materias = data),
      error: (err) => console.error('Error al obtener materias', err),
    });
  }

  obtenerGestionCursos() {
    this.gestionCursoService.getGestionCursos().subscribe({
      next: (data) => {
        this.gestionCursos = data.map((g: any) => ({
          ...g,
          label: `${g.gestion_periodo}, ${g.curso_nombre}`,
          value: g.id,
        }));
      },
      error: (err) => console.error('Error al obtener gestión-curso', err),
    });
  }

  /* obtenerHorarios() {
    this.horariosService.getHorarios().subscribe({
      next: (data: Horarios[]) => {
        this.horarios = data;
        this.actualizarDiasHorariosTable();
        this.actualizarDiasHorariosOptions();
      },
      error: (err) => console.error('Error al obtener horarios', err),
    });
  } */

  /* obtenerDiasHorarios() {
    if (typeof this.horariosService['getDiasHorarios'] === 'function') {
      this.horariosService['getDiasHorarios']().subscribe({
        next: (data: DiaHorarioAPI[]) => {
          this.diasHorarios = data;
          this.actualizarDiasHorariosTable();
          this.actualizarDiasHorariosOptions();
        },
        error: (err: any) =>
          console.error('Error al obtener diasHorarios', err),
      });
    }
  } */

  /* actualizarDiasHorariosTable() {
    this.diasHorariosTable = this.diasHorarios.map((dh) => {
      const diaObj = DIAS.find((d) => d.id === dh.dia);
      const horarioObj = this.horarios.find((h) => h.id === dh.horario);
      return {
        id: dh.id,
        dia_nombre: diaObj ? diaObj.nombre : '',
        horario_inicio: horarioObj ? horarioObj.hora_inicio : '',
        horario_fin: horarioObj ? horarioObj.hora_fin : '',
      };
    });
  }

  actualizarDiasHorariosOptions() {
    this.diasHorariosOptions = this.diasHorariosTable.map((dh) => ({
      label: `${dh.dia_nombre} ${dh.horario_inicio} - ${dh.horario_fin}`,
      value: dh.id,
    }));
  } */

  obtenerCursos() {
    this.cursosService.getCursos().subscribe({
      next: (data) => (this.cursos = data),
      error: (err) => console.error('Error al obtener cursos', err),
    });
  }

  obtenerGestiones() {
    this.gestionesService.getGestiones().subscribe({
      next: (data) => (this.gestiones = data),
      error: (err) => console.error('Error al obtener gestiones', err),
    });
  }

  obtenerProfesores() {
    this.usuarioService.getProfesores().subscribe({
      next: (data) => (this.profesores = data),
      error: (err) => console.error('Error al obtener profesores', err),
    });
  }

  obtenerAsignaciones() {
    this.asignacionesService.getAsignaciones().subscribe({
      next: (data) => {
        console.log('Asignaciones obtenidas:', data);
        this.asignaciones = data.map((a) => this.mapAsignacionToView(a));
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener asignaciones', err),
    });
  }

  /* getDiaHorarioLabel(diaHorarioId: number): string {
    const dh = this.diasHorariosTable.find((d) => d.id === diaHorarioId);
    return dh
      ? `${dh.dia_nombre} ${dh.horario_inicio} - ${dh.horario_fin}`
      : '';
  } */

  mapAsignacionToView(a: any): AsignacionesView {
    const materia = this.materias.find((m) => m.id === a.materia);

    // Busca el objeto gestionCurso original (no solo el label/value)
    const gestionCurso =
      this.gestionCursos.find((g) => g.value === a.gestion_curso) || {};

    // Si tu backend ya trae curso_nombre y gestion_periodo en gestionCurso, úsalos directamente:
    const curso_nombre = gestionCurso.curso_nombre || '';
    const gestion_periodo = gestionCurso.gestion_periodo || '';

    const profesor = this.profesores.find((p) => p.id === a.profesor);
    const profesor_nombre = profesor
      ? `${profesor.nombre ?? ''} ${profesor.apellidos ?? ''}`.trim()
      : '';

    const diaHorarios = this.diasHorariosTable.find((d) =>
      a.dia_horarios.includes(d.id)
    );
    if (!diaHorarios) {
      console.warn(`No se encontró diaHorario para asignación con ID ${a.id}`);
    }

    return {
      id: a.id,
      materia_nombre: materia?.nombre || '',
      curso_nombre,
      profesor_nombre,
      gestion_periodo,
      dia_horarios: a.dia_horarios.map((dh: number) => {
        const diaHorario = this.diasHorariosTable.find((d) => d.id === dh);
        return diaHorario
          ? `${(diaHorario as any).dia_nombre ?? ''} ${
              (diaHorario as any).horario_inicio ?? ''
            } - ${(diaHorario as any).horario_fin ?? ''}`
          : '';
      }),
    };
  }

  aplicarFiltros(): void {
    let filtradas = [...this.asignaciones];
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      filtradas = filtradas.filter((a) =>
        (
          a.materia_nombre +
          a.curso_nombre +
          a.profesor_nombre +
          a.gestion_periodo +
          a.dia_horarios
        )
          .toLowerCase()
          .includes(termino)
      );
    }
    this.asignacionesFiltradas = filtradas;
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
    return this.asignacionesFiltradas
      ? this.first + this.rows >= this.asignacionesFiltradas.length
      : true;
  }

  isFirstPage(): boolean {
    return this.asignacionesFiltradas ? this.first === 0 : true;
  }

  openNew() {
    this.asignacionActual = { ...ASIGNACION_VACIA };
    this.selectedMateria = 0;
    this.selectedGestionCurso = 0;
    this.selectedProfesor = 0;
    this.selectedDiaHorarios = [];
    this.submitted = false;
    this.isEdit = false;
    this.asignacionDialog = true;
  }

  editAsignacion(asignacion: AsignacionesView) {
    this.asignacionesService.getAsignacion(asignacion.id).subscribe({
      next: (a) => {
        this.asignacionActual = { ...a };
        this.selectedMateria = a.materia;
        this.selectedGestionCurso = a.gestion_curso;
        this.selectedProfesor = a.profesor;
        this.selectedDiaHorarios = [...a.dia_horarios];
        this.isEdit = true;
        this.asignacionDialog = true;
      },
    });
  }

  deleteAsignacion(asignacion: AsignacionesView) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar la asignación de "${asignacion.materia_nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.asignacionesService.deleteAsignacion(asignacion.id).subscribe({
          next: () => {
            this.asignaciones = this.asignaciones.filter(
              (a) => a.id !== asignacion.id
            );
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Asignación eliminada correctamente',
              life: 3000,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la asignación',
              life: 3000,
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.asignacionDialog = false;
    this.submitted = false;
  }

  saveAsignacion() {
    this.submitted = true;
    if (
      this.selectedMateria &&
      this.selectedGestionCurso &&
      this.selectedProfesor &&
      this.selectedDiaHorarios.length > 0
    ) {
      const asignacionToSend: AsignacionesAPI = {
        id: this.asignacionActual.id,
        materia: this.selectedMateria,
        gestion_curso: this.selectedGestionCurso,
        profesor: this.selectedProfesor,
        dia_horarios: this.selectedDiaHorarios,
      };

      if (this.isEdit && this.asignacionActual.id) {
        this.asignacionesService
          .updateAsignacion(this.asignacionActual.id, asignacionToSend)
          .subscribe({
            next: () => {
              this.obtenerAsignaciones();
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Asignación actualizada correctamente',
                life: 3000,
              });
              this.asignacionDialog = false;
              this.asignacionActual = { ...ASIGNACION_VACIA };
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar la asignación',
                life: 3000,
              });
            },
          });
      } else {
        this.asignacionesService.createAsignacion(asignacionToSend).subscribe({
          next: () => {
            this.obtenerAsignaciones();
            this.messageService.add({
              severity: 'success',
              summary: 'Registrado',
              detail: 'Asignación creada correctamente',
              life: 3000,
            });
            this.asignacionDialog = false;
            this.asignacionActual = { ...ASIGNACION_VACIA };
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear la asignación',
              life: 3000,
            });
          },
        });
      }
    }
  }
}
