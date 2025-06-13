import { Component, type OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor/profesor.service';
import { ActivatedRoute } from '@angular/router';
import type { verAsistencias } from '../../../interfaces/profesorMaterias';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-asistencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencias.component.html',
  styles: ``,
})
export class AsistenciasProfComponent implements OnInit {
  constructor(
    private profesorService: ProfesorService,
    private route: ActivatedRoute
  ) {}

  asistencias: verAsistencias[] = [];
  asistenciasFiltradas: verAsistencias[] = [];

  gestionCursoId = 0;
  materiaId = 0;

  // Filtros
  filtroFecha = '';
  filtroAlumno = '';
  filtroEstado = 'todos';

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
    this.verAsistencias();
  }

  verAsistencias() {
    this.profesorService
      .verAsistencias(this.gestionCursoId, this.materiaId)
      .subscribe({
        next: (data) => {
          this.asistencias = data;
          this.asistenciasFiltradas = [...this.asistencias];
          this.ordenarPor('fecha'); // Ordenar por fecha por defecto
          console.log('Asistencias:', this.asistencias);
        },
        error: (error) => {
          console.error('Error al obtener asistencias:', error);
        },
      });
  }

  aplicarFiltros() {
    this.asistenciasFiltradas = this.asistencias.filter((asistencia) => {
      // Filtro por alumno
      const coincideAlumno = this.filtroAlumno
        ? asistencia.alumno
            .toLowerCase()
            .includes(this.filtroAlumno.toLowerCase())
        : true;

      // Filtro por fecha
      const coincideFecha = this.filtroFecha
        ? asistencia.fecha.includes(this.filtroFecha)
        : true;

      // Filtro por estado
      let coincideEstado = true;
      if (this.filtroEstado === 'presente') {
        coincideEstado = asistencia.asistio === true;
      } else if (this.filtroEstado === 'ausente') {
        coincideEstado = asistencia.asistio === false;
      }

      return coincideAlumno && coincideFecha && coincideEstado;
    });

    // Mantener el orden actual
    this.ordenarDatos();
  }

  limpiarFiltros() {
    this.filtroFecha = '';
    this.filtroAlumno = '';
    this.filtroEstado = 'todos';
    this.asistenciasFiltradas = [...this.asistencias];
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
    this.asistenciasFiltradas.sort((a, b) => {
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
        case 'asistio':
          valorA = a.asistio;
          valorB = b.asistio;
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

  contarPresentes(): number {
    return this.asistenciasFiltradas.filter((a) => a.asistio).length;
  }

  contarAusentes(): number {
    return this.asistenciasFiltradas.filter((a) => !a.asistio).length;
  }

  // Exportar a CSV
  exportarCSV() {
    if (this.asistenciasFiltradas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear cabeceras
    const cabeceras = ['Alumno', 'Fecha', 'Estado'];

    // Convertir datos a filas CSV
    const filasDatos = this.asistenciasFiltradas.map((item) => {
      return [
        item.alumno,
        this.formatearFecha(item.fecha),
        item.asistio ? 'Presente' : 'Ausente',
      ];
    });

    // Combinar cabeceras y datos
    const csvArray = [cabeceras, ...filasDatos];

    // Convertir a formato CSV
    const csvContent = csvArray.map((fila) => fila.join(',')).join('\n');

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Configurar nombre de archivo con fecha actual
    const fecha = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `asistencias_${fecha}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Exportar a Excel
  exportarExcel() {
    if (this.asistenciasFiltradas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Preparar datos para Excel
    const datosExcel = this.asistenciasFiltradas.map((item) => {
      return {
        Alumno: item.alumno,
        Fecha: this.formatearFecha(item.fecha),
        Estado: item.asistio ? 'Presente' : 'Ausente',
      };
    });

    // Crear libro y hoja de trabajo
    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet(datosExcel);

    // Añadir hoja al libro
    XLSX.utils.book_append_sheet(libro, hoja, 'Asistencias');

    // Configurar nombre de archivo con fecha actual
    const fecha = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `asistencias_${fecha}.xlsx`;

    // Guardar archivo
    XLSX.writeFile(libro, nombreArchivo);
  }

  // Exportar a PDF
  exportarPDF() {
    if (this.asistenciasFiltradas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear nuevo documento PDF
    const doc = new jsPDF();

    // Añadir título
    const fecha = new Date().toLocaleDateString();
    doc.setFontSize(18);
    doc.text('Reporte de Asistencias', 14, 22);

    // Añadir información adicional
    doc.setFontSize(11);
    doc.text(`Fecha de generación: ${fecha}`, 14, 30);
    doc.text(`Total de registros: ${this.asistenciasFiltradas.length}`, 14, 36);
    doc.text(`Alumnos presentes: ${this.contarPresentes()}`, 14, 42);
    doc.text(`Alumnos ausentes: ${this.contarAusentes()}`, 14, 48);

    // Preparar datos para la tabla
    const body = this.asistenciasFiltradas.map((item) => [
      item.alumno,
      this.formatearFecha(item.fecha),
      item.asistio ? 'Presente' : 'Ausente',
    ]);

    // Generar tabla
    autoTable(doc, {
      head: [['Alumno', 'Fecha', 'Estado']],
      body: body,
      startY: 56,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [100, 100, 100],
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
      },
      headStyles: {
        fillColor: [79, 70, 229], // Color índigo para mantener consistencia
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawCell: (data) => {
        // Colorear las celdas de estado
        if (data.column.index === 2 && data.cell.section === 'body') {
          const estado = data.cell.text[0];
          if (estado === 'Presente') {
            data.cell.styles.fillColor = [220, 252, 231]; // Verde claro
            data.cell.styles.textColor = [22, 101, 52]; // Verde oscuro
          } else if (estado === 'Ausente') {
            data.cell.styles.fillColor = [254, 226, 226]; // Rojo claro
            data.cell.styles.textColor = [153, 27, 27]; // Rojo oscuro
          }
        }
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
    doc.save(`asistencias_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}
