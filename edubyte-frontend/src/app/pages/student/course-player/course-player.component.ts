import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, interval, takeUntil } from 'rxjs';
import { CoursesService } from '../../../services/courses.service';
import { ProgressService } from '../../../services/progress.service';
import { SnackbarService } from '../../../services/snackbar.service';

interface Lesson {
  id: number;
  titulo: string;
  url?: string;
  contenido?: string;
  orden: number;
  tipo: string;
  duracion?: number;
  completada?: boolean;
}

interface Section {
  id: number;
  titulo: string;
  orden: number;
  duracionEstimada?: number;
  lecciones: Lesson[];
  expanded: boolean;
}

interface Course {
  id: number;
  titulo: string;
  descripcion: string;
  secciones: Section[];
}

interface Note {
  id: string;
  timestamp: number;
  text: string;
  createdAt: Date;
}

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoFrame') videoFrame?: ElementRef<HTMLIFrameElement>;

  courseId: string = '';
  lessonId: string = '';
  course: Course | null = null;
  currentLesson: Lesson | null = null;
  currentSection: Section | null = null;
  safeVideoUrl: SafeResourceUrl | null = null;

  // Progress tracking
  timeSpent: number = 0; // seconds
  progressPercentage: number = 0;
  private timeTracker$ = new Subject<void>();

  // Notes
  notes: Note[] = [];
  noteControl = new FormControl('');
  showNotes: boolean = false;

  // UI State
  sidebarOpen: boolean = true;
  activeTab: 'overview' | 'notes' | 'resources' = 'overview';
  loading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private progressService: ProgressService,
    private snackbarService: SnackbarService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.courseId = params.get('courseId') || '';
        this.lessonId = params.get('lessonId') || '';

        if (this.courseId && this.lessonId) {
          this.loadCourseData();
        }
      });

    // Track time spent every 10 seconds
    interval(10000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.currentLesson && !this.currentLesson.completada) {
          this.timeSpent += 10;
          this.updateProgress();
        }
      });
  }

  ngOnDestroy(): void {
    // Save progress before leaving
    if (this.courseId && this.lessonId) {
      this.saveProgress();
    }

    this.destroy$.next();
    this.destroy$.complete();
    this.timeTracker$.next();
    this.timeTracker$.complete();
  }

  loadCourseData(): void {
    this.loading = true;
    this.coursesService.getCourseById(this.courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const courseData = response.data || response;
          this.course = {
            ...courseData,
            secciones: courseData.secciones.map((sec: any) => ({
              ...sec,
              expanded: false,
              lecciones: sec.lecciones || []
            }))
          };

          this.findCurrentLesson();
          this.loadSavedProgress();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading course:', error);
          this.snackbarService.showError('Error al cargar el curso');
          this.loading = false;
        }
      });
  }

  findCurrentLesson(): void {
    if (!this.course) return;

    for (const section of this.course.secciones) {
      const lesson = section.lecciones.find(l => l.id === +this.lessonId);
      if (lesson) {
        this.currentLesson = lesson;
        this.currentSection = section;
        section.expanded = true;
        this.prepareVideoUrl();
        return;
      }
    }
  }

  prepareVideoUrl(): void {
    if (!this.currentLesson?.url) {
      this.safeVideoUrl = null;
      return;
    }

    let videoUrl = this.currentLesson.url;

    // Convert YouTube URL to embed format
    if (videoUrl.includes('youtube.com/watch')) {
      const url = new URL(videoUrl);
      const videoId = url.searchParams.get('v');
      if (videoId) {
        videoUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
      }
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        videoUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
      }
    }

    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }

  toggleSection(sectionId: number): void {
    if (!this.course) return;
    const section = this.course.secciones.find(s => s.id === sectionId);
    if (section) {
      section.expanded = !section.expanded;
    }
  }

  selectLesson(lesson: Lesson, section: Section): void {
    if (this.currentLesson?.id === lesson.id) return;

    // Save current progress before switching
    this.saveProgress();

    // Navigate to new lesson
    this.router.navigate([
      '/student/course',
      this.courseId,
      'lesson',
      lesson.id
    ]);
  }

  markAsCompleted(): void {
    if (!this.currentLesson || !this.courseId) return;

    // Mark as completed locally
    this.currentLesson.completada = true;
    this.snackbarService.showSuccess('¡Lección completada!');

    // TODO: Add API call to mark lesson as complete when backend endpoint is ready
    // For now, we'll just move to the next lesson
    this.goToNextLesson();
  }

  goToNextLesson(): void {
    if (!this.course || !this.currentSection || !this.currentLesson) return;

    const currentSectionIndex = this.course.secciones.findIndex(
      s => s.id === this.currentSection!.id
    );
    const currentLessonIndex = this.currentSection.lecciones.findIndex(
      l => l.id === this.currentLesson!.id
    );

    // Try next lesson in current section
    if (currentLessonIndex < this.currentSection.lecciones.length - 1) {
      const nextLesson = this.currentSection.lecciones[currentLessonIndex + 1];
      this.selectLesson(nextLesson, this.currentSection);
      return;
    }

    // Try first lesson of next section
    if (currentSectionIndex < this.course.secciones.length - 1) {
      const nextSection = this.course.secciones[currentSectionIndex + 1];
      if (nextSection.lecciones.length > 0) {
        this.selectLesson(nextSection.lecciones[0], nextSection);
        return;
      }
    }

    // Course completed!
    this.snackbarService.showSuccess('¡Has completado todo el curso!');
  }

  goToPreviousLesson(): void {
    if (!this.course || !this.currentSection || !this.currentLesson) return;

    const currentSectionIndex = this.course.secciones.findIndex(
      s => s.id === this.currentSection!.id
    );
    const currentLessonIndex = this.currentSection.lecciones.findIndex(
      l => l.id === this.currentLesson!.id
    );

    // Try previous lesson in current section
    if (currentLessonIndex > 0) {
      const prevLesson = this.currentSection.lecciones[currentLessonIndex - 1];
      this.selectLesson(prevLesson, this.currentSection);
      return;
    }

    // Try last lesson of previous section
    if (currentSectionIndex > 0) {
      const prevSection = this.course.secciones[currentSectionIndex - 1];
      if (prevSection.lecciones.length > 0) {
        const lastLesson = prevSection.lecciones[prevSection.lecciones.length - 1];
        this.selectLesson(lastLesson, prevSection);
      }
    }
  }

  addNote(): void {
    const noteText = this.noteControl.value?.trim();
    if (!noteText) return;

    const note: Note = {
      id: Date.now().toString(),
      timestamp: this.timeSpent,
      text: noteText,
      createdAt: new Date()
    };

    this.notes.unshift(note);
    this.noteControl.setValue('');
    this.saveNotesToLocalStorage();
    this.snackbarService.showSuccess('Nota guardada');
  }

  deleteNote(noteId: string): void {
    this.notes = this.notes.filter(n => n.id !== noteId);
    this.saveNotesToLocalStorage();
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setActiveTab(tab: 'overview' | 'notes' | 'resources'): void {
    this.activeTab = tab;
  }

  getCompletedLessonsCount(): number {
    if (!this.course) return 0;
    return this.course.secciones.reduce((count, section) => {
      return count + section.lecciones.filter(l => l.completada).length;
    }, 0);
  }

  getTotalLessonsCount(): number {
    if (!this.course) return 0;
    return this.course.secciones.reduce((count, section) => {
      return count + section.lecciones.length;
    }, 0);
  }

  getCourseProgress(): number {
    const total = this.getTotalLessonsCount();
    if (total === 0) return 0;
    const completed = this.getCompletedLessonsCount();
    return Math.round((completed / total) * 100);
  }

  private updateProgress(): void {
    if (!this.courseId || !this.lessonId) return;

    this.progressService.updateTimeSpent(
      +this.courseId,
      {
        leccionId: +this.lessonId,
        tiempoDedicadoSegundos: this.timeSpent
      }
    ).subscribe({
      error: (error: any) => console.error('Error updating progress:', error)
    });
  }

  private saveProgress(): void {
    if (this.timeSpent > 0) {
      this.updateProgress();
    }
  }

  private loadSavedProgress(): void {
    // Load from localStorage or API
    const saved = localStorage.getItem(`progress_${this.courseId}_${this.lessonId}`);
    if (saved) {
      const data = JSON.parse(saved);
      this.timeSpent = data.timeSpent || 0;
    }

    // Load notes
    this.loadNotesFromLocalStorage();
  }

  private saveNotesToLocalStorage(): void {
    localStorage.setItem(
      `notes_${this.courseId}_${this.lessonId}`,
      JSON.stringify(this.notes)
    );
  }

  private loadNotesFromLocalStorage(): void {
    const saved = localStorage.getItem(`notes_${this.courseId}_${this.lessonId}`);
    if (saved) {
      this.notes = JSON.parse(saved);
    }
  }

  hasNextLesson(): boolean {
    if (!this.course || !this.currentSection || !this.currentLesson) return false;

    const currentSectionIndex = this.course.secciones.findIndex(
      s => s.id === this.currentSection!.id
    );
    const currentLessonIndex = this.currentSection.lecciones.findIndex(
      l => l.id === this.currentLesson!.id
    );

    // Check if there's next lesson in current section
    if (currentLessonIndex < this.currentSection.lecciones.length - 1) {
      return true;
    }

    // Check if there's next section with lessons
    return currentSectionIndex < this.course.secciones.length - 1;
  }

  hasPreviousLesson(): boolean {
    if (!this.course || !this.currentSection || !this.currentLesson) return false;

    const currentSectionIndex = this.course.secciones.findIndex(
      s => s.id === this.currentSection!.id
    );
    const currentLessonIndex = this.currentSection.lecciones.findIndex(
      l => l.id === this.currentLesson!.id
    );

    return currentSectionIndex > 0 || currentLessonIndex > 0;
  }
}
