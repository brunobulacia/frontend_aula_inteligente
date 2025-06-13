// alumnos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlumnoXMateria } from '../../../interfaces/profesorMaterias';
import { ProfesorService } from '../../../services/profesor/profesor.service';
import { MessageService } from 'primeng/api';
import { LucideAngularModule } from 'lucide-angular';
import {
  BookIcon,
  UserIcon,
  MailIcon,
  IdCardIcon,
  MapPinIcon,
  HomeIcon,
  SearchIcon,
  ClipboardCheckIcon,
  MessageSquareIcon,
} from 'lucide-angular';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { Calificar } from '../../../interfaces/profesorMaterias';

interface GradeForm {
  ser: number | null;
  saber: number | null;
  hacer: number | null;
  decidir: number | null;
}

interface AttendanceForm {
  date: Date | null;
  status: string | null;
  observation: string;
}

interface ParticipationForm {
  date: Date | null;
  type: string | null;
  points: number | null;
  comments: string;
}

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    CardModule,
    AvatarModule,
    ButtonModule,
    ProgressSpinnerModule,
    ToastModule,
    InputTextModule,
    DialogModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    TextareaModule,
  ],
  providers: [MessageService],
  templateUrl: './alumnos.component.html',
  styles: ``,
})
export class AlumnosComponent implements OnInit {
  materiaId!: number;
  alumnos: AlumnoXMateria[] = [];
  filteredAlumnos: AlumnoXMateria[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';

  // Dialog controls
  displayGradeDialog: boolean = false;
  displayAttendanceDialog: boolean = false;
  displayParticipationDialog: boolean = false;
  selectedStudent: AlumnoXMateria | null = null;
  submittingGrades: boolean = false;
  submittingAttendance: boolean = false;
  submittingParticipation: boolean = false;

  // Form models
  gradeForm: GradeForm = {
    ser: null,
    saber: null,
    hacer: null,
    decidir: null,
  };

  attendanceForm: AttendanceForm = {
    date: null,
    status: null,
    observation: '',
  };

  participationForm: ParticipationForm = {
    date: null,
    type: null,
    points: null,
    comments: '',
  };

  // Dropdown options
  attendanceStatusOptions = [
    { label: 'Presente', value: 'present' },
    { label: 'Ausente', value: 'absent' },
    { label: 'Tardanza', value: 'late' },
    { label: 'Justificado', value: 'excused' },
  ];

  participationTypeOptions = [
    { label: 'Pregunta', value: 'question' },
    { label: 'Respuesta', value: 'answer' },
    { label: 'Presentación', value: 'presentation' },
    { label: 'Debate', value: 'debate' },
    { label: 'Otro', value: 'other' },
  ];

  // Icon references
  BookIcon = BookIcon;
  UserIcon = UserIcon;
  MailIcon = MailIcon;
  IdCardIcon = IdCardIcon;
  MapPinIcon = MapPinIcon;
  HomeIcon = HomeIcon;
  SearchIcon = SearchIcon;
  ClipboardCheckIcon = ClipboardCheckIcon;
  MessageSquareIcon = MessageSquareIcon;

  constructor(
    private route: ActivatedRoute,
    private profesorService: ProfesorService,
    private messageService: MessageService
  ) {}

  calificacion: Calificar = {
    alumno_id: this.selectedStudent?.id || 0,
    materia_id: 0,
    gestion_curso: 0,
    ser: 0,
    saber: 0,
    hacer: 0,
    decidir: 0,
  };

  ngOnInit(): void {
    this.materiaId = Number(this.route.snapshot.paramMap.get('id'));
    this.calificacion.gestion_curso = Number(
      this.route.snapshot.paramMap.get('gestion_curso')
    );
    this.calificacion.materia_id = Number(
      this.route.snapshot.paramMap.get('materia_id')
    );
    this.loadAlumnos();
  }

  loadAlumnos(): void {
    this.loading = true;
    this.profesorService.getAlumnoXMaterias(this.materiaId).subscribe({
      next: (data) => {
        this.alumnos = data;
        console.log(data);
        this.filteredAlumnos = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Error al cargar los alumnos';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los alumnos',
        });
      },
    });
  }

  filterAlumnos(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = value;

    if (value) {
      this.filteredAlumnos = this.alumnos.filter(
        (alumno) =>
          alumno.nombre.toLowerCase().includes(value) ||
          alumno.apellidos.toLowerCase().includes(value) ||
          alumno.email.toLowerCase().includes(value) ||
          alumno.ci.toLowerCase().includes(value)
      );
    } else {
      this.filteredAlumnos = [...this.alumnos];
    }
  }

  getInitials(nombre: string, apellidos: string): string {
    return (nombre.charAt(0) + apellidos.charAt(0)).toUpperCase();
  }

  getAvatarColor(id: number): string {
    const colors = [
      'bg-slate-700 text-slate-100',
      'bg-slate-800 text-slate-100',
      'bg-indigo-900 text-indigo-100',
      'bg-emerald-800 text-emerald-100',
      'bg-amber-800 text-amber-100',
      'bg-rose-800 text-rose-100',
    ];
    return colors[id % colors.length];
  }

  // Grade Dialog Methods
  openGradeDialog(student: AlumnoXMateria): void {
    this.selectedStudent = student;
    this.resetGradeForm();
    this.displayGradeDialog = true;
  }

  resetGradeForm(): void {
    this.gradeForm = {
      ser: null,
      saber: null,
      hacer: null,
      decidir: null,
    };
  }

  submitGrades(): void {
    if (!this.isGradeFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor complete todos los campos de calificación',
      });
      return;
    }

    this.submittingGrades = true;

    if (!this.selectedStudent) {
      this.submittingGrades = false;
      return;
    }

    const calificacion: Calificar = {
      alumno_id: this.selectedStudent.id,
      materia_id: this.calificacion.materia_id,
      gestion_curso: this.calificacion.gestion_curso,
      ser: this.gradeForm.ser ?? 0,
      saber: this.gradeForm.saber ?? 0,
      hacer: this.gradeForm.hacer ?? 0,
      decidir: this.gradeForm.decidir ?? 0,
    };

    this.profesorService.calificarAlumno(calificacion).subscribe({
      next: () => {
        this.submittingGrades = false;
        this.displayGradeDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Calificación registrada',
          detail: `La calificación para ${this.selectedStudent?.nombre} ${this.selectedStudent?.apellidos} ha sido registrada exitosamente`,
        });
      },
      error: (err) => {
        this.submittingGrades = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar la calificación',
        });
        console.error('Error al calificar:', err);
      },
    });
  }

  isGradeFormValid(): boolean {
    return (
      this.gradeForm.ser !== null &&
      this.gradeForm.saber !== null &&
      this.gradeForm.hacer !== null &&
      this.gradeForm.decidir !== null &&
      this.gradeForm.ser >= 0 &&
      this.gradeForm.ser <= 100 &&
      this.gradeForm.saber >= 0 &&
      this.gradeForm.saber <= 100 &&
      this.gradeForm.hacer >= 0 &&
      this.gradeForm.hacer <= 100 &&
      this.gradeForm.decidir >= 0 &&
      this.gradeForm.decidir <= 100
    );
  }

  calculateTotal(): number {
    const { ser, saber, hacer, decidir } = this.gradeForm;
    return (ser ?? 0) + (saber ?? 0) + (hacer ?? 0) + (decidir ?? 0);
  }

  // Attendance Dialog Methods
  openAttendanceDialog(student: AlumnoXMateria): void {
    this.selectedStudent = student;
    this.resetAttendanceForm();
    this.displayAttendanceDialog = true;
  }

  resetAttendanceForm(): void {
    this.attendanceForm = {
      date: new Date(),
      status: null,
      observation: '',
    };
  }

  submitAttendance(): void {
    if (!this.isAttendanceFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor complete la fecha y el estado de asistencia',
      });
      return;
    }

    this.submittingAttendance = true;

    // Simulate API call
    setTimeout(() => {
      this.submittingAttendance = false;
      this.displayAttendanceDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Asistencia registrada',
        detail: `La asistencia para ${this.selectedStudent?.nombre} ${this.selectedStudent?.apellidos} ha sido registrada exitosamente`,
      });

      // Here you would normally call your API service to save the attendance
      console.log(
        'Attendance submitted for student:',
        this.selectedStudent?.id
      );
      console.log('Attendance:', this.attendanceForm);
    }, 1000);
  }

  isAttendanceFormValid(): boolean {
    return (
      this.attendanceForm.date !== null && this.attendanceForm.status !== null
    );
  }

  // Participation Dialog Methods
  openParticipationDialog(student: AlumnoXMateria): void {
    this.selectedStudent = student;
    this.resetParticipationForm();
    this.displayParticipationDialog = true;
  }

  resetParticipationForm(): void {
    this.participationForm = {
      date: new Date(),
      type: null,
      points: 5,
      comments: '',
    };
  }

  submitParticipation(): void {
    if (!this.isParticipationFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor complete la fecha, tipo y puntos de participación',
      });
      return;
    }

    this.submittingParticipation = true;

    // Simulate API call
    setTimeout(() => {
      this.submittingParticipation = false;
      this.displayParticipationDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Participación registrada',
        detail: `La participación para ${this.selectedStudent?.nombre} ${this.selectedStudent?.apellidos} ha sido registrada exitosamente`,
      });

      // Here you would normally call your API service to save the participation
      console.log(
        'Participation submitted for student:',
        this.selectedStudent?.id
      );
      console.log('Participation:', this.participationForm);
    }, 1000);
  }

  isParticipationFormValid(): boolean {
    return (
      this.participationForm.date !== null &&
      this.participationForm.type !== null &&
      this.participationForm.points !== null &&
      this.participationForm.points >= 0 &&
      this.participationForm.points <= 10
    );
  }
}
