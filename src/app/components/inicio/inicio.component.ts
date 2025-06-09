import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import {
  LucideAngularModule,
  House,
  UserRoundCheck,
  Users,
  LogOut,
  BookOpenText,
  NotebookPen,
  PcCase,
  Hand,
  ChartNoAxesCombined,
  ListChecks,
} from 'lucide-angular';
import { AuthService } from '../../services/auth/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    LucideAngularModule,
    AvatarModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './inicio.component.html',
  styles: ``,
})
export class InicioComponent implements OnInit {
  readonly HouseIcon = House;
  readonly UserRoundCheckIcon = UserRoundCheck;
  readonly UsersIcon = Users;
  readonly LogOutIcon = LogOut;
  readonly BookOpenTextIcon = BookOpenText;
  readonly NotebookPenIcon = NotebookPen;
  readonly PcCaseIcon = PcCase;
  readonly HandIcon = Hand;
  readonly ChartNoAxesCombinedIcon = ChartNoAxesCombined;
  readonly ListChecksIcon = ListChecks;
  currentUser: any = null;
  openAlumno = false;
  openProfesor = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.authService.getProfile();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    if (this.currentUser?.nombre && this.currentUser?.apellidos) {
      return (
        this.currentUser.nombre.charAt(0) + this.currentUser.apellidos.charAt(0)
      ).toUpperCase();
    }
    return 'AD';
  }

  getUserRole(): string {
    switch (this.currentUser?.tipo_usuario) {
      case 'admin':
        return 'Administrador';
      case 'prof':
        return 'Profesor';
      case 'alum':
        return 'Alumno';
      default:
        return 'Usuario';
    }
  }
}
