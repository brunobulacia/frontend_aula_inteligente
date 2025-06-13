import { Component, type OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor/profesor.service';
import { ActivatedRoute } from '@angular/router';
import type { verParticipaciones } from '../../../interfaces/profesorMaterias';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-participaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participaciones.component.html',
  styles: ``,
})
export class ParticipacionesProfComponent implements OnInit {
  constructor(
    private profesorService: ProfesorService,
    private route: ActivatedRoute
  ) {}

  participaciones: verParticipaciones[] = [];
  participacionesFiltradas: verParticipaciones[] = [];

  gestionCursoId = 0;
  materiaId = 0;

  // Filtros
  filtroFecha = '';
  filtroAlumno = '';
  filtroDescripcion = '';

  // Ordenamiento
  ordenColumna = 'fecha';
  ordenAscendente = false;

  ngOnInit() {
    this.gestionCursoId = Number(
      this.route.snapshot.paramMap.get('gestion_curso')
    );

    this.materiaId = Number(this.route.snapshot.paramMap.get('materia'));

    console.log('Materia ID:', this.materiaId);
    console.log('Gestion Curso ID:', this.gestionCursoId);
    this.verParticipaciones();
  }

  verParticipaciones() {
    this.profesorService
      .verParticipaciones(this.gestionCursoId, this.materiaId)
      .subscribe({
        next: (data) => {
          this.participaciones = data;
          this.participacionesFiltradas = [...this.participaciones];
          this.ordenarPor('fecha'); // Ordenar por fecha por defecto
          console.log('Participaciones:', this.participaciones);
        },
        error: (error) => {
          console.error('Error al obtener participaciones:', error);
        },
      });
  }

  aplicarFiltros() {
    this.participacionesFiltradas = this.participaciones.filter(
      (participacion) => {
        // Filtro por alumno
        const coincideAlumno = this.filtroAlumno
          ? participacion.alumno
              .toLowerCase()
              .includes(this.filtroAlumno.toLowerCase())
          : true;

        // Filtro por fecha
        const coincideFecha = this.filtroFecha
          ? participacion.fecha.includes(this.filtroFecha)
          : true;

        // Filtro por descripción
        const coincideDescripcion = this.filtroDescripcion
          ? participacion.descripcion
              .toLowerCase()
              .includes(this.filtroDescripcion.toLowerCase())
          : true;

        return coincideAlumno && coincideFecha && coincideDescripcion;
      }
    );

    // Mantener el orden actual
    this.ordenarDatos();
  }

  limpiarFiltros() {
    this.filtroFecha = '';
    this.filtroAlumno = '';
    this.filtroDescripcion = '';
    this.participacionesFiltradas = [...this.participaciones];
    this.ordenarDatos();
  }

  ordenarPor(columna: string) {
    if (this.ordenColumna === columna) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.ordenColumna = columna;
      this.ordenAscendente = true;
    }

    this.ordenarDatos();
  }

  ordenarDatos() {
    this.participacionesFiltradas.sort((a, b) => {
      let valorA: any;
      let valorB: any;

      switch (this.ordenColumna) {
        case 'alumno':
          valorA = a.alumno.toLowerCase();
          valorB = b.alumno.toLowerCase();
          break;
        case 'fecha':
          valorA = new Date(a.fecha);
          valorB = new Date(b.fecha);
          break;
        case 'descripcion':
          valorA = a.descripcion.toLowerCase();
          valorB = b.descripcion.toLowerCase();
          break;
        default:
          return 0;
      }

      if (valorA < valorB) {
        return this.ordenAscendente ? -1 : 1;
      }
      if (valorA > valorB) {
        return this.ordenAscendente ? 1 : -1;
      }
      return 0;
    });
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString();
  }

  contarParticipacionesUnicas(): number {
    const alumnosUnicos = new Set(
      this.participacionesFiltradas.map((p) => p.alumno)
    );
    return alumnosUnicos.size;
  }

  contarParticipacionesTotales(): number {
    return this.participacionesFiltradas.length;
  }

  obtenerFechasUnicas(): number {
    const fechasUnicas = new Set(
      this.participacionesFiltradas.map((p) => p.fecha)
    );
    return fechasUnicas.size;
  }

  // Exportar a CSV
  exportarCSV() {
    if (this.participacionesFiltradas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear cabeceras
    const cabeceras = ['Alumno', 'Fecha', 'Descripción'];

    // Convertir datos a filas CSV
    const filasDatos = this.participacionesFiltradas.map((item) => {
      return [item.alumno, this.formatearFecha(item.fecha), item.descripcion];
    });

    // Combinar cabeceras y datos
    const csvArray = [cabeceras, ...filasDatos];

    // Convertir a formato CSV
    const csvContent = csvArray
      .map((fila) => fila.map((campo) => `"${campo}"`).join(','))
      .join('\n');

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Configurar nombre de archivo con fecha actual
    const fecha = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `participaciones_${fecha}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Exportar a Excel
  exportarExcel() {
    if (this.participacionesFiltradas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Preparar datos para Excel
    const datosExcel = this.participacionesFiltradas.map((item) => {
      return {
        Alumno: item.alumno,
        Fecha: this.formatearFecha(item.fecha),
        Descripción: item.descripcion,
      };
    });

    // Crear libro y hoja de trabajo
    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet(datosExcel);

    // Ajustar ancho de columnas
    const anchoColumnas = [
      { wch: 25 }, // Alumno
      { wch: 12 }, // Fecha
      { wch: 50 }, // Descripción
    ];
    hoja['!cols'] = anchoColumnas;

    // Añadir hoja al libro
    XLSX.utils.book_append_sheet(libro, hoja, 'Participaciones');

    // Configurar nombre de archivo con fecha actual
    const fecha = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `participaciones_${fecha}.xlsx`;

    // Guardar archivo
    XLSX.writeFile(libro, nombreArchivo);
  }

  // Exportar a PDF
  exportarPDF() {
    if (this.participacionesFiltradas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear nuevo documento PDF
    const doc = new jsPDF();

    // Añadir título
    const fecha = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.text('Reporte de Participaciones', 14, 22);

    // Añadir información adicional
    doc.setFontSize(11);
    doc.text(`Fecha de generación: ${fecha}`, 14, 30);
    doc.text(
      `Total de participaciones: ${this.participacionesFiltradas.length}`,
      14,
      36
    );
    doc.text(
      `Alumnos participantes: ${this.contarParticipacionesUnicas()}`,
      14,
      42
    );

    // Preparar datos para la tabla
    const body = this.participacionesFiltradas.map((item) => [
      item.alumno,
      this.formatearFecha(item.fecha),
      item.descripcion,
    ]);

    // Generar tabla
    autoTable(doc, {
      head: [['Alumno', 'Fecha', 'Descripción']],
      body: body,
      startY: 50,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [100, 100, 100],
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 'auto' },
      },
      headStyles: {
        fillColor: [128, 0, 128],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Añadir paginación
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Página ${i} de ${pageCount}`,
        (doc as any).internal.pageSize.width - 30,
        (doc as any).internal.pageSize.height - 10
      );
    }

    // Guardar el PDF
    doc.save(`participaciones_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}
