import { Component, ViewChild } from '@angular/core';
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
import { LucideAngularModule, Trash, Edit } from 'lucide-angular';

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
    LucideAngularModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './usuarios.component.html',
  standalone: true,
  styles: ``,
})
export class UsuariosComponent {
  readonly TrashIcon = Trash;
  readonly EditIcon = Edit;
  usuarios: Usuario[] = [];
  usuarioActual: Partial<Usuario> = {};
  usuarioDialog = false;
  submitted = false;
  first = 0;
  rows = 10;
  isEdit = false;

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error al obtener usuarios', err),
    });
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
    return this.usuarios
      ? this.first + this.rows >= this.usuarios.length
      : true;
  }

  isFirstPage(): boolean {
    return this.usuarios ? this.first === 0 : true;
  }

  // CRUD
  openNew() {
    this.usuarioActual = {};
    this.submitted = false;
    this.isEdit = false;
    this.usuarioDialog = true;
  }

  editUsuario(usuario: Usuario) {
    this.usuarioActual = { ...usuario };
    this.isEdit = true;
    this.usuarioDialog = true;
  }

  deleteUsuario(usuario: Usuario) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar a ${usuario.nombre} ${usuario.apellidos}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.deleteUsuario(usuario.id).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
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
      this.usuarioActual.tipo_usuario
    ) {
      if (this.isEdit && this.usuarioActual.id) {
        // Editar
        this.usuarioService
          .updateUsuario(this.usuarioActual.id, this.usuarioActual as Usuario)
          .subscribe({
            next: (usuario) => {
              const idx = this.usuarios.findIndex((u) => u.id === usuario.id);
              if (idx > -1) this.usuarios[idx] = usuario;
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Usuario actualizado correctamente',
                life: 3000,
              });
              this.usuarioDialog = false;
              this.usuarioActual = {};
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
        // Crear
        this.usuarioService
          .createUsuario(this.usuarioActual as Usuario)
          .subscribe({
            next: (usuario) => {
              this.usuarios.push(usuario);
              this.messageService.add({
                severity: 'success',
                summary: 'Creado',
                detail: 'Usuario creado correctamente',
                life: 3000,
              });
              this.usuarioDialog = false;
              this.usuarioActual = {};
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo crear el usuario',
                life: 3000,
              });
            },
          });
      }
    }
  }
}
