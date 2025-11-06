// lesson-player.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const lessonId = params.get('id');
        console.log('Lesson ID:', lessonId);
        // Cargar datos de la lección
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
}