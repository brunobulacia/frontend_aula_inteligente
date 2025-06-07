import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuarios/usuarios.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Usuario } from '../../../interfaces/usuario';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import {
  LucideAngularModule,
  Trash,
  Edit,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Mail,
  MapPin,
  User,
  Shield,
  Search,
  Filter,
  X,
} from 'lucide-angular';
import { Registro } from '../../../interfaces/registro';
import { AuthService } from '../../../services/auth/auth.service';

const USUARIO_VACIO: Usuario = {
  id: 0,
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  tipo_usuario: '',
  direccion: {
    id: 0,
    ciudad: '',
    zona: '',
    calle: '',
    numero: 0,
    referencia: '',
  },
};

interface TipoUsuarioOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-usuarios',
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
    TagModule,
    CardModule,
    DividerModule,
    DropdownModule,
    LucideAngularModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './usuarios.component.html',
  standalone: true,
  styles: `
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 14px;
    }
    
    .action-button {
      transition: all 0.2s ease;
      border-radius: 8px;
    }
    
    .action-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .form-section {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .gradient-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .filter-section {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid #e2e8f0;
    }

    .search-input {
      position: relative;
    }

    .search-input .p-inputtext {
      padding-left: 2.5rem;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      z-index: 10;
    }

    .filter-badge {
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .clear-filters-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .clear-filters-btn:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }
  `,
})
export class UsuariosComponent {
  readonly TrashIcon = Trash;
  readonly EditIcon = Edit;
  readonly UsersIcon = Users;
  readonly PlusIcon = Plus;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly RotateCcwIcon = RotateCcw;
  readonly MailIcon = Mail;
  readonly MapPinIcon = MapPin;
  readonly UserIcon = User;
  readonly ShieldIcon = Shield;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly XIcon = X;

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuarioActual: Usuario = { ...USUARIO_VACIO };
  registroActual: Registro = {
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    tipo_usuario: '',
    direccion: {
      ciudad: '',
      zona: '',
      calle: '',
      numero: 0,
      referencia: '',
    },
  };
  usuarioDialog = false;
  submitted = false;
  first = 0;
  rows = 10;
  isEdit = false;

  // Filtros
  searchTerm = '';
  selectedTipoUsuario: string | null = null;

  tiposUsuario: TipoUsuarioOption[] = [
    { label: 'Todos los tipos', value: '' },
    { label: 'Administrador', value: 'admin' },
    { label: 'Profesor', value: 'prof' },
    { label: 'Alumno', value: 'alum' },
  ];

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al obtener usuarios', err),
    });
  }

  aplicarFiltros(): void {
    let usuariosFiltrados = [...this.usuarios];

    // Filtro por término de búsqueda (nombre, apellidos, email)
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      usuariosFiltrados = usuariosFiltrados.filter(
        (usuario) =>
          usuario.nombre.toLowerCase().includes(termino) ||
          usuario.apellidos.toLowerCase().includes(termino) ||
          usuario.email.toLowerCase().includes(termino) ||
          `${usuario.nombre} ${usuario.apellidos}`
            .toLowerCase()
            .includes(termino)
      );
    }

    // Filtro por tipo de usuario
    if (this.selectedTipoUsuario && this.selectedTipoUsuario !== '') {
      usuariosFiltrados = usuariosFiltrados.filter(
        (usuario) => usuario.tipo_usuario === this.selectedTipoUsuario
      );
    }

    this.usuariosFiltrados = usuariosFiltrados;
    this.first = 0; // Resetear paginación al aplicar filtros
  }

  onSearchChange(): void {
    this.aplicarFiltros();
  }

  onTipoUsuarioChange(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.selectedTipoUsuario = null;
    this.aplicarFiltros();
    this.messageService.add({
      severity: 'info',
      summary: 'Filtros limpiados',
      detail: 'Se han eliminado todos los filtros',
      life: 2000,
    });
  }

  get hayFiltrosActivos(): boolean {
    return (
      this.searchTerm.trim() !== '' ||
      (this.selectedTipoUsuario !== null && this.selectedTipoUsuario !== '')
    );
  }

  get contadorFiltros(): number {
    let contador = 0;
    if (this.searchTerm.trim() !== '') contador++;
    if (this.selectedTipoUsuario && this.selectedTipoUsuario !== '') contador++;
    return contador;
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
    return this.usuariosFiltrados
      ? this.first + this.rows >= this.usuariosFiltrados.length
      : true;
  }

  isFirstPage(): boolean {
    return this.usuariosFiltrados ? this.first === 0 : true;
  }

  openNew() {
    this.usuarioActual = {
      ...USUARIO_VACIO,
      direccion: { ...USUARIO_VACIO.direccion },
    };
    this.submitted = false;
    this.isEdit = false;
    this.usuarioDialog = true;
  }

  editUsuario(usuario: Usuario) {
    this.usuarioActual = {
      ...usuario,
      direccion: usuario.direccion
        ? { ...usuario.direccion }
        : { ...USUARIO_VACIO.direccion },
    };
    this.isEdit = true;
    this.usuarioDialog = true;
  }

  deleteUsuario(usuario: Usuario) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar a ${usuario.nombre} ${usuario.apellidos}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.usuarioService.deleteUsuario(usuario.id).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
            this.aplicarFiltros(); // Reaplica filtros después de eliminar
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Usuario eliminado correctamente',
              life: 3000,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el usuario',
              life: 3000,
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.usuarioDialog = false;
    this.submitted = false;
  }

  saveUsuario() {
    this.submitted = true;
    if (
      this.usuarioActual.nombre &&
      this.usuarioActual.apellidos &&
      this.usuarioActual.email &&
      this.usuarioActual.tipo_usuario &&
      this.usuarioActual.direccion &&
      this.usuarioActual.direccion.ciudad &&
      this.usuarioActual.direccion.zona &&
      this.usuarioActual.direccion.calle &&
      this.usuarioActual.direccion.numero !== undefined &&
      this.usuarioActual.direccion.referencia
    ) {
      if (this.isEdit && this.usuarioActual.id) {
        this.usuarioService
          .updateUsuario(this.usuarioActual.id, this.usuarioActual)
          .subscribe({
            next: (usuario) => {
              const idx = this.usuarios.findIndex((u) => u.id === usuario.id);
              if (idx > -1) this.usuarios[idx] = usuario;
              this.aplicarFiltros(); // Reaplica filtros después de actualizar
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Usuario actualizado correctamente',
                life: 3000,
              });
              this.usuarioDialog = false;
              this.usuarioActual = {
                ...USUARIO_VACIO,
                direccion: { ...USUARIO_VACIO.direccion },
              };
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el usuario',
                life: 3000,
              });
            },
          });
      } else {
        this.registroActual = {
          nombre: this.usuarioActual.nombre,
          apellidos: this.usuarioActual.apellidos,
          email: this.usuarioActual.email,
          password: this.usuarioActual.password,
          tipo_usuario: this.usuarioActual.tipo_usuario,
          direccion: {
            ciudad: this.usuarioActual.direccion.ciudad,
            zona: this.usuarioActual.direccion.zona,
            calle: this.usuarioActual.direccion.calle,
            numero: this.usuarioActual.direccion.numero,
            referencia: this.usuarioActual.direccion.referencia,
          },
        };

        console.log(this.registroActual);
        this.authService.registrar(this.registroActual).subscribe({
          next: (usuario) => {
            this.usuarios.push(this.usuarioActual);
            this.aplicarFiltros(); // Reaplica filtros después de crear
            this.messageService.add({
              severity: 'success',
              summary: 'Registrado',
              detail: 'Usuario registrado correctamente',
              life: 3000,
            });
            this.usuarioDialog = false;
            this.usuarioActual = {
              ...USUARIO_VACIO,
              direccion: { ...USUARIO_VACIO.direccion },
            };
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo registrar el usuario',
              life: 3000,
            });
          },
        });
      }
    }
  }

  getUserTypeColor(tipo: string): string {
    switch (tipo) {
      case 'admin':
        return 'danger';
      case 'prof':
        return 'warning';
      case 'alum':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getUserTypeLabel(tipo: string): string {
    switch (tipo) {
      case 'admin':
        return 'Administrador';
      case 'prof':
        return 'Profesor';
      case 'alum':
        return 'Alumno';
      default:
        return tipo;
    }
  }

  getInitials(nombre: string, apellidos: string): string {
    return (nombre.charAt(0) + apellidos.charAt(0)).toUpperCase();
  }

  getAvatarColor(id: number): string {
    const colors = [
      '#667eea',
      '#764ba2',
      '#f093fb',
      '#f5576c',
      '#4facfe',
      '#00f2fe',
    ];
    return colors[id % colors.length];
  }
}
