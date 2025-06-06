import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { authGuard } from './guards/auth-guard/auth.guard';
import { MateriasComponent } from './admin/components/materias/materias.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { roleGuard } from './guards/role-guard/role.guard';
import { UsuariosComponent } from './admin/components/usuarios/usuarios.component';
import { AdminComponent } from './admin/components/admin/admin.component';

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
    ],
  },
];
