import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';

// Interfaces basadas en tu API
interface Leccion {
  id: number;
  titulo: string;
  tipo: string;
  url: string;
  contenido: string | null;
  orden: number;
  seccionId: number;
  visible: boolean;
  creadoEn: string;
  actualizadoEn: string | null;
  duracionEstimada?: number; // minutos (opcional, para generar si no existe)
}

interface Seccion {
  id: number;
  titulo: string;
  orden: number;
  cursoId: number;
  visible: boolean;
  creadoEn: string;
  actualizadoEn: string | null;
  duracionEstimada: number;
  lecciones: Leccion[];
}

interface Instructor {
  nombre: string;
  apellido: string;
}

interface Adjunto {
  url: string;
}

interface CourseDetails {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  precioAnterior?: number;
  categoriaNombre?: string;
  instructor: Instructor | string;
  adjunto?: Adjunto;
  creadoEn: string;
  secciones: Seccion[];
}

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  private coursesService = inject(CoursesService);
  private route = inject(ActivatedRoute);

  courseId: string = '';
  courseDetails: CourseDetails | null = null;
  isLoading = false;
  error: string | null = null;

  // Control de acordeones
  expandedSections: Set<number> = new Set();
  expandedLessons: Set<number> = new Set();

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    if (this.courseId) {
      this.loadCourseDetails();
    }
  }

  private loadCourseDetails(): void {
    this.isLoading = true;
    this.error = null;

    this.coursesService.getCourseById(this.courseId).subscribe({
      next: (data: any) => {
        console.log('📦 Datos del curso:', data);
        
        // Extraer datos según la estructura de tu API
        const courseData = data.data || data;
        
        this.courseDetails = {
          id: courseData.id,
          titulo: courseData.titulo,
          descripcion: courseData.descripcion,
          precio: courseData.precio,
          precioAnterior: courseData.precioAnterior,
          categoriaNombre: courseData.categoriaNombre,
          instructor: courseData.instructor,
          adjunto: courseData.adjunto,
          creadoEn: courseData.creadoEn,
          secciones: this.processSections(courseData.secciones || [])
        };

        console.log('✅ Curso procesado:', this.courseDetails);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.error = 'Error al cargar el curso';
        this.isLoading = false;
      }
    });
  }

  // Procesar secciones y añadir duración si no existe
  private processSections(secciones: any[]): Seccion[] {
    return secciones
      .sort((a, b) => a.orden - b.orden) // Ordenar por orden
      .map(seccion => ({
        ...seccion,
        duracionEstimada: seccion.duracionEstimada || this.calculateSectionDuration(seccion.lecciones),
        lecciones: this.processLessons(seccion.lecciones || [])
      }));
  }

  // Procesar lecciones
  private processLessons(lecciones: any[]): Leccion[] {
    return lecciones
      .sort((a, b) => a.orden - b.orden) // Ordenar por orden
      .map(leccion => ({
        ...leccion,
        duracionEstimada: leccion.duracionEstimada || this.generateRandomMinutes()
      }));
  }

  // Calcular duración total de una sección
  private calculateSectionDuration(lecciones: Leccion[]): number {
    return lecciones.reduce((total, leccion) => {
      return total + (leccion.duracionEstimada || this.generateRandomMinutes());
    }, 0);
  }

  // Generar minutos aleatorios (5-45 min)
  private generateRandomMinutes(): number {
    return Math.floor(Math.random() * 41) + 5;
  }

  // Toggle sección
  toggleSection(sectionId: number): void {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
  }

  // Toggle lección
  toggleLesson(lessonId: number): void {
    if (this.expandedLessons.has(lessonId)) {
      this.expandedLessons.delete(lessonId);
    } else {
      this.expandedLessons.add(lessonId);
    }
  }

  // Verificar si la sección está expandida
  isSectionExpanded(sectionId: number): boolean {
    return this.expandedSections.has(sectionId);
  }

  // Verificar si la lección está expandida
  isLessonExpanded(lessonId: number): boolean {
    return this.expandedLessons.has(lessonId);
  }

  // Reproducir lección
  playLesson(leccion: Leccion): void {
    if (!leccion.visible) {
      console.log('⚠️ Lección no disponible');
      return;
    }
    console.log('▶️ Reproduciendo:', leccion.titulo, leccion.url);
    // Implementar lógica de reproducción
  }

  // Calcular duración total del curso
  getTotalCourseDuration(): string {
    if (!this.courseDetails) return '0min';
    
    const totalMinutes = this.courseDetails.secciones.reduce((total, seccion) => {
      return total + seccion.duracionEstimada;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }

  // Contar total de lecciones
  getTotalLessons(): number {
    if (!this.courseDetails) return 0;
    return this.courseDetails.secciones.reduce((total, seccion) => {
      return total + seccion.lecciones.length;
    }, 0);
  }

  // Obtener icono según tipo de lección
  getLessonIcon(tipo: string): string {
    switch (tipo.toUpperCase()) {
      case 'VIDEO':
        return 'play_circle';
      case 'LECTURA':
        return 'article';
      case 'QUIZ':
        return 'quiz';
      case 'ARCHIVO':
        return 'file_download';
      default:
        return 'description';
    }
  }

  // Formatear duración
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  // Obtener nombre del instructor
  getInstructorName(): string {
    if (!this.courseDetails || !this.courseDetails.instructor) {
      return 'Instructor';
    }
    if (typeof this.courseDetails.instructor === 'string') {
      return this.courseDetails.instructor;
    }
    return `${this.courseDetails.instructor.nombre} ${this.courseDetails.instructor.apellido}`;
  }
}
