import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { authGuard } from './guards/auth-guard/auth.guard';
import { MateriasComponent } from './admin/components/materias/materias.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import {
  roleGuard,
  profGuard,
  alumGuard,
} from './guards/role-guard/role.guard';
// TODO: Update the path below if the file exists elsewhere, or create the file if missing.

import { UsuariosComponent } from './admin/components/usuarios/usuarios.component';
import { AdminComponent } from './admin/components/admin/admin.component';
import { CursosComponent } from './admin/components/cursos/cursos.component';
import { HorariosComponent } from './admin/components/horarios/horarios.component';
import { GestionesComponent } from './admin/components/gestiones/gestiones.component';
import { GestionCursoComponent } from './admin/components/gestion-curso/gestion-curso.component';
import { HorarioDiaComponent } from './admin/components/horario-dia/horario-dia.component';
import { AsignacionesComponent } from './admin/components/asignaciones/asignaciones.component';
import { MateriasProfComponent } from './profesor/components/materias/materias.component';
import { AsistenciasProfComponent } from './profesor/components/asistencias/asistencias.component';
import { ParticipacionesProfComponent } from './profesor/components/participaciones/participaciones.component';
import { InscripcionesComponent } from './admin/components/inscripciones/inscripciones.component';
import { NotasAdminComponent } from './admin/components/notas/notas.component';
import { AlumnosComponent } from './profesor/components/alumnos/alumnos.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'inicio',
    canActivate: [authGuard],
    component: InicioComponent,
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },

      {
        path: 'profesor',
        canActivate: [authGuard, profGuard],
        children: [
          {
            path: 'materias',
            component: MateriasProfComponent,
          },
          {
            path: 'alumnos/:id/:gestion_curso/:materia',
            component: AlumnosComponent,
          },
          {
            path: 'asistencias/:id/:gestion_curso/:materia',
            component: AsistenciasProfComponent,
          },
          {
            path: 'participaciones/:id/:gestion_curso/:materia',
            component: ParticipacionesProfComponent,
          },
        ],
      },
    ],
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    component: AdminComponent,
    children: [
      {
        path: 'materias',
        component: MateriasComponent,
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
      },
      {
        path: 'cursos',
        component: CursosComponent,
      },
      {
        path: 'horarios',
        component: HorariosComponent,
      },
      {
        path: 'gestiones',
        component: GestionesComponent,
      },
      {
        path: 'gestiones-cursos',
        component: GestionCursoComponent,
      },
      {
        path: 'horarios-dias',
        component: HorarioDiaComponent,
      },
      {
        path: 'asignaciones',
        component: AsignacionesComponent,
      },
      {
        path: 'inscripciones',
        component: InscripcionesComponent,
      },
      {
        path: 'notas',
        component: NotasAdminComponent,
      },
    ],
  },
];
