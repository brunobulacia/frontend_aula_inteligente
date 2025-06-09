import { Component, OnInit } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../../services/auth/auth.service';
import {
  Book,
  GraduationCap,
  LogOut,
  LucideAngularModule,
  Trash,
  Users,
  CalendarCheck2,
  FileText,
  School,
  CalendarClock,
  UserRoundCheck,
  House,
  BookOpenTextIcon,
  NotebookPenIcon,
  PcCaseIcon,
  HandIcon,
  ListChecks,
  UserPlus,
} from 'lucide-angular';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet,
    PanelMenuModule,
    CommonModule,
    AvatarModule,
    BadgeModule,
    RippleModule,
    TooltipModule,
    DividerModule,
    LucideAngularModule,
    RouterLink,
  ],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  currentUser: any = null;
  readonly TrashIcon = Trash;
  readonly UsersIcon = Users;
  readonly LogOutIcon = LogOut;
  readonly GraduationCapIcon = GraduationCap;
  readonly BookIcon = Book;
  readonly CalendarCheck2Icon = CalendarCheck2;
  readonly FileTextIcon = FileText;
  readonly SchoolIcon = School;
  readonly CalendarClockIcon = CalendarClock;
  readonly UserRoundCheckIcon = UserRoundCheck;
  readonly HouseIcon = House;
  readonly BookOpenTextIcon = BookOpenTextIcon;
  readonly NotebookPenIcon = NotebookPenIcon;
  readonly PcCaseIcon = PcCaseIcon;
  readonly HandIcon = HandIcon;
  readonly ListChecksIcon = ListChecks;
  readonly UserPlusIcon = UserPlus;
  openAcademica = false;
  openUsuarios = false;
  openHorarios = false;
  openActividades = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.authService.getProfile();
  }

  logoutItem = [
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
      styleClass: 'logout-item',
    },
  ];

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
