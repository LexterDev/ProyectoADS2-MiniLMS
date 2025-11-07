// lesson-player.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CoursesService } from '../../../../services/courses.service';
import { DomSanitizer } from '@angular/platform-browser';

interface Lesson {
  id: number;
  titulo: string;
  duracion: string;
  orden: number;
  completada: boolean;
  bloqueada: boolean;
}

interface Section {
  id: number;
  titulo: string;
  lecciones: Lesson[];
  expanded: boolean;
}

interface Course {
  id: number;
  titulo: string;
  descripcion: string;
  progreso: number;
  secciones: Section[];
}

interface Resource {
  id: number;
  nombre: string;
  tipo: 'PDF' | 'ZIP' | 'DOCX';
  url: string;
  icono: string;
}

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lesson-player.component.html',
  styleUrls: ['./lesson-player.component.css']
})
export class LessonPlayerComponent implements OnInit, OnDestroy {

  LessonId: string = '';
  CourseId: string = '';
  sectionId: string = '';
  lessonsbySection: any[] = [];
  currentLessonObject: any = {};
  safeUrl: any;

  private destroy$ = new Subject<void>();

  activeTab: 'descripcion' | 'recursos' | 'comentarios' | 'transcripcion' = 'descripcion';

  currentLesson = {
    id: 1,
    titulo: 'Introducción al Desarrollo Web',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    descripcion: 'En esta lección, exploraremos los fundamentos del desarrollo web, incluyendo HTML, CSS y JavaScript. Aprenderás cómo estructurar páginas web, aplicar estilos y agregar interactividad.',
    contenidoCompleto: 'Este curso te guiará a través de los conceptos básicos del desarrollo web, desde la configuración del entorno hasta la implementación de aplicaciones web completas. Cubriremos temas como la estructura de páginas web, el diseño responsivo, la manipulación del DOM y la interacción con APIs.'
  };

  course: Course = {
    id: 1,
    titulo: 'Desarrollo Web Completo',
    descripcion: 'Aprende desarrollo web desde cero',
    progreso: 25,
    secciones: [
      {
        id: 1,
        titulo: 'Introducción',
        expanded: true,
        lecciones: [
          { id: 1, titulo: 'Introducción al Desarrollo Web', duracion: '8:00', orden: 1, completada: true, bloqueada: false },
          { id: 2, titulo: 'Configuración del Entorno', duracion: '10:00', orden: 2, completada: false, bloqueada: false },
          { id: 3, titulo: 'Herramientas Esenciales', duracion: '8:00', orden: 3, completada: false, bloqueada: false }
        ]
      },
      {
        id: 2,
        titulo: 'HTML Básico',
        expanded: false,
        lecciones: [
          { id: 4, titulo: 'Estructura HTML', duracion: '12:00', orden: 1, completada: false, bloqueada: false },
          { id: 5, titulo: 'Etiquetas Semánticas', duracion: '15:00', orden: 2, completada: false, bloqueada: false }
        ]
      },
      {
        id: 3,
        titulo: 'CSS Fundamentals',
        expanded: false,
        lecciones: [
          { id: 6, titulo: 'Selectores CSS', duracion: '10:00', orden: 1, completada: false, bloqueada: true },
          { id: 7, titulo: 'Flexbox', duracion: '20:00', orden: 2, completada: false, bloqueada: true }
        ]
      }
    ]
  };

  recursos: Resource[] = [
    {
      id: 1,
      nombre: 'Guía de inicio rápido',
      tipo: 'PDF',
      url: '#',
      icono: 'document'
    },
    {
      id: 2,
      nombre: 'Código fuente del proyecto',
      tipo: 'ZIP',
      url: '#',
      icono: 'code'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  this.route.paramMap
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {
      this.LessonId = params.get('id') ?? '';
      this.CourseId = params.get('courseId') ?? '';
      this.sectionId = params.get('sectionId') ?? '';
      
      console.log('Lesson ID:', this.LessonId);
      console.log('Course ID:', this.CourseId);
      console.log('Section ID:', this.sectionId);
      
      // Cargar datos solo si tenemos los IDs necesarios
      if (this.CourseId && this.LessonId) {
        this.getCourseDetails();
      }
    });
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSection(sectionId: number): void {
    const section = this.course.secciones.find(s => s.id === sectionId);
    if (section) {
      section.expanded = !section.expanded;
    }
  }

  selectLesson(lesson: Lesson): void {
    if (lesson.bloqueada) {
      return;
    }
    console.log('Seleccionando lección:', lesson.titulo);
    // Cambiar a la nueva lección
  }

  markAsCompleted(): void {
    console.log('Marcando lección como completada');
    // Lógica para marcar como completada
  }

  goToPreviousLesson(): void {
    console.log('Ir a lección anterior');
  }

  goToNextLesson(): void {
    console.log('Ir a siguiente lección');
  }

  downloadResource(resource: Resource): void {
    console.log('Descargando:', resource.nombre);
    // Lógica para descargar recurso
  }

  setActiveTab(tab: 'descripcion' | 'recursos' | 'comentarios' | 'transcripcion'): void {
    this.activeTab = tab;
  }

  getCourseDetails(): void {
  this.coursesService.getCourseById(this.CourseId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        console.log('Detalles del curso desde lesson:', data);
        
        // Procesar y asignar los datos del curso
        const courseData = data.data || data;
        this.course = courseData;
        
        // Encontrar las lecciones de la sección actual
        this.lessonsbySection = this.course.secciones.find(
          s => s.id === +this.sectionId
        )?.lecciones || [];
        console.log('Lecciones de la sección actual:', this.lessonsbySection);
        
        // Encontrar la lección actual
        this.currentLessonObject = this.lessonsbySection.find(
          (l: any) => l.id === +this.LessonId
        ) || {};
        console.log('Lección actual:', this.currentLessonObject);
        
        // ✅ Sanitizar URL DESPUÉS de obtener los datos
        this.getSafeUrl();
      },
      error: (error) => {
        console.error('Error al cargar detalles del curso:', error);
        // this.error = 'No se pudo cargar el curso';
      }
    });
}

getSafeUrl(): void {
  if (!this.currentLessonObject?.url) {
    console.warn('⚠️ La lección no tiene URL de video');
    this.safeUrl = null;
    return;
  }

  try {
    let videoUrl = this.currentLessonObject.url;
    
    console.log('🎬 URL original del video:', videoUrl);

    // Convertir URL de YouTube a formato embed si es necesario
    if (videoUrl.includes('youtube.com/watch')) {
      const url = new URL(videoUrl);
      const videoId = url.searchParams.get('v');
      if (videoId) {
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
        console.log('🔄 URL convertida a embed:', videoUrl);
      }
    } 
    // Si es URL corta de YouTube (youtu.be)
    else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
        console.log('🔄 URL convertida a embed:', videoUrl);
      }
    }

    // Sanitizar la URL
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    console.log('✅ URL sanitizada correctamente');

  } catch (error) {
    console.error('❌ Error al sanitizar URL:', error);
    this.safeUrl = null;
  }
}
}