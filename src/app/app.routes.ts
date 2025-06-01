import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { RestringidoComponent } from './auth/restringido/restringido.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegistroComponent,
  },
  {
    path: 'restringido',
    canActivate: [authGuard],
    component: RestringidoComponent,
  },
];
