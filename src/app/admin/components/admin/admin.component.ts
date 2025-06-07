import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { icons } from 'lucide-angular';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, PanelMenuModule],
  templateUrl: './admin.component.html',
  styles: ``,
})
export class AdminComponent {
  constructor(private authService: AuthService, private router: Router) {}
  items = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: ['/inicio/perfil'],
    },
    {
      label: 'Gestionar Materias',
      icon: 'pi pi-book',
      routerLink: ['/admin/materias'],
    },
    {
      label: 'Administrar Usuarios',
      icon: 'pi pi-users',
      routerLink: ['/admin/usuarios'],
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
      styleClass: 'text-red-600 font-semibold',
    },
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
