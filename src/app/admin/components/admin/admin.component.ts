import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, PanelMenuModule],
  templateUrl: './admin.component.html',
  styles: ``,
})
export class AdminComponent {
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
  ];
}
