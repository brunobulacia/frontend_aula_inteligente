import { CanActivateFn, Router } from '@angular/router';
import swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  // Check if the user is authenticated

  const token = localStorage.getItem('token');
  if (!token) {
    // If not authenticated, redirect to login page
    const router = new Router();
    swal.fire({
      icon: 'warning',
      title: 'Acceso denegado',
      text: 'Debes estar logueado para acceder a esta página.',
    });
    router.navigate(['/login']);
    return false;
  }
  return true;
};
