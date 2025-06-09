import { CanActivateFn, Router } from '@angular/router';
import swal from 'sweetalert2';
import { authGuard } from '../auth-guard/auth.guard';

export const roleGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = authGuard(route, state);
  if (!isAuthenticated) {
    const router = new Router();
    swal.fire({
      icon: 'warning',
      title: 'Acceso denegado',
      text: 'Debes estar logueado para acceder a esta página.',
    });
    router.navigate(['/login']);
    return false;
  }

  //OBTENER EL ROL DEL USUARIO DESDE EL LOCAL STORAGE
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const userRole = profile?.tipo_usuario || null;

  if (userRole !== 'admin') {
    swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tienes permisos para acceder a esta página.',
    });
    const router = new Router();
    router.navigate(['/inicio']);
    return false;
  }

  return true;
};

export const profGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = authGuard(route, state);
  if (!isAuthenticated) {
    const router = new Router();
    swal.fire({
      icon: 'warning',
      title: 'Acceso denegado',
      text: 'Debes estar logueado para acceder a esta página.',
    });
    router.navigate(['/login']);
    return false;
  }

  //OBTENER EL ROL DEL USUARIO DESDE EL LOCAL STORAGE
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const userRole = profile?.tipo_usuario || null;

  if (userRole !== 'prof') {
    swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tienes permisos para acceder a esta página.',
    });
    const router = new Router();
    router.navigate(['/inicio']);
    return false;
  }

  return true;
};

export const alumGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = authGuard(route, state);
  if (!isAuthenticated) {
    const router = new Router();
    swal.fire({
      icon: 'warning',
      title: 'Acceso denegado',
      text: 'Debes estar logueado para acceder a esta página.',
    });
    router.navigate(['/login']);
    return false;
  }

  //OBTENER EL ROL DEL USUARIO DESDE EL LOCAL STORAGE
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const userRole = profile?.tipo_usuario || null;

  if (userRole !== 'alum') {
    swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tienes permisos para acceder a esta página.',
    });
    const router = new Router();
    router.navigate(['/inicio']);
    return false;
  }

  return true;
};
