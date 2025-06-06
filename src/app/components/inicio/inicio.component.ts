import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterOutlet, PanelMenuModule],
  templateUrl: './inicio.component.html',
  styles: ``,
})
export class InicioComponent {
  items = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: ['/inicio'],
    },
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      routerLink: ['/inicio/perfil'],
    },
    {
      label: 'Administración',
      icon: 'pi pi-users',
      routerLink: ['/admin'],
    },
  ];
}
