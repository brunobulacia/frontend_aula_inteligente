import { Component } from '@angular/core';
import { ProfesorService } from '../../../services/profesor/profesor.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-asistencias',
  imports: [],
  templateUrl: './asistencias.component.html',
  styles: ``,
})
export class AsistenciasProfComponent {
  constructor(
    private profesorService: ProfesorService,
    private route: ActivatedRoute
  ) {}

  gestionCursoId: number = 0;
  materiaId: number = 0;
}
