import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotasAdminService } from '../../../services/notas-admin/notas-admin.service';
import { NotasAdmin } from '../../../interfaces/notas';
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

const NOTA_VACIA: NotasAdmin = {
  ser: 0,
  saber: 0,
  hacer: 0,
  decidir: 0,
  nota_final: 0,
};

@Component({
  selector: 'app-notas',
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
  templateUrl: './notas.component.html',
  standalone: true,
})
export class NotasAdminComponent {
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

  notas: NotasAdmin[] = [];
  notasFiltradas: NotasAdmin[] = [];
  notaActual: NotasAdmin = { ...NOTA_VACIA };
  notaDialog = false;
  submitted = false;
  first = 0;
  rows = 10;
  isEdit = false;

  // Filtros
  searchTerm = '';

  constructor(
    private notasAdminService: NotasAdminService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerNotas();
  }

  obtenerNotas(): void {
    this.notasAdminService.getNotas().subscribe({
      next: (data) => {
        this.notas = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener notas', err),
    });
  }

  aplicarFiltros(): void {
    let notasFiltradas = [...this.notas];
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      notasFiltradas = notasFiltradas.filter((nota) =>
        Object.values(nota).join(' ').toLowerCase().includes(termino)
      );
    }
    this.notasFiltradas = notasFiltradas;
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
    return this.notasFiltradas
      ? this.first + this.rows >= this.notasFiltradas.length
      : true;
  }

  isFirstPage(): boolean {
    return this.notasFiltradas ? this.first === 0 : true;
  }

  openNew() {
    this.notaActual = { ...NOTA_VACIA };
    this.submitted = false;
    this.isEdit = false;
    this.notaDialog = true;
  }

  editNota(nota: NotasAdmin) {
    this.notaActual = { ...nota };
    this.isEdit = true;
    this.notaDialog = true;
  }

  deleteNota(nota: NotasAdmin) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar esta nota?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        // Aquí deberías tener un id único, si no lo tienes, ajusta según tu backend
        // this.notasAdminService.deleteNota(nota.id).subscribe({...});
        this.messageService.add({
          severity: 'warn',
          summary: 'No implementado',
          detail: 'No se puede eliminar sin un identificador único',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.notaDialog = false;
    this.submitted = false;
  }

  saveNota() {
    this.submitted = true;
    if (
      this.notaActual.ser !== null &&
      this.notaActual.saber !== null &&
      this.notaActual.hacer !== null &&
      this.notaActual.decidir !== null &&
      this.notaActual.nota_final !== null
    ) {
      if (this.isEdit) {
        // Aquí deberías tener un id único, si no lo tienes, ajusta según tu backend
        // this.notasAdminService.updateNota(this.notaActual.id, this.notaActual).subscribe({...});
        this.messageService.add({
          severity: 'warn',
          summary: 'No implementado',
          detail: 'No se puede editar sin un identificador único',
          life: 3000,
        });
      } else {
        this.notasAdminService.createNota(this.notaActual).subscribe({
          next: (nota) => {
            this.notas.push(nota);
            this.aplicarFiltros();
            this.messageService.add({
              severity: 'success',
              summary: 'Registrado',
              detail: 'Nota creada correctamente',
              life: 3000,
            });
            this.notaDialog = false;
            this.notaActual = { ...NOTA_VACIA };
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear la nota',
              life: 3000,
            });
          },
        });
      }
    }
  }
}
