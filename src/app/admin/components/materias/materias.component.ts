import { Component, OnInit } from '@angular/core';
import { MateriasService } from '../../../services/materias/materias.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Materias } from '../../../interfaces/materias';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-materias',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './materias.component.html',
  styles: ``,
})
export class MateriasComponent implements OnInit {
  materias: Materias[] = [];
  materiaActual: Partial<Materias> = {};
  mostrarModal = false;

  constructor(
    private materiasService: MateriasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerMaterias();
  }

  obtenerMaterias() {
    this.materiasService.getMaterias().subscribe({
      next: (data) => (this.materias = data),
      error: (err) => console.error('Error al obtener materias', err),
    });
  }

  abrirModal(editar: boolean = false, materia?: Materias) {
    this.mostrarModal = true;
    if (editar && materia) {
      this.materiaActual = { ...materia };
    } else {
      this.materiaActual = {};
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.materiaActual = {};
  }

  onSubmitModal() {
    if (this.materiaActual.id) {
      // Editar
      this.materiasService
        .updateMateria(this.materiaActual.id, this.materiaActual as Materias)
        .subscribe({
          next: () => {
            this.obtenerMaterias();
            this.cerrarModal();
          },
          error: (err) => console.error('Error al actualizar', err),
        });
    } else if (this.materiaActual.nombre) {
      // Crear
      this.materiasService
        .createMateria(this.materiaActual as Materias)
        .subscribe({
          next: () => {
            this.obtenerMaterias();
            this.cerrarModal();
          },
          error: (err) => console.error('Error al crear', err),
        });
    }
  }

  editarMateria(materia: Materias) {
    this.abrirModal(true, materia);
  }

  eliminarMateria(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta materia?')) {
      this.materiasService.deleteMateria(id).subscribe({
        next: () => this.obtenerMaterias(),
        error: (err) => console.error('Error al eliminar', err),
      });
    }
  }
}
