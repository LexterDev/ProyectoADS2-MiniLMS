import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Review, ReviewStats } from '../../models/review.model';
import { StarRatingComponent } from '../shared/star-rating/star-rating.component';

@Component({
  selector: 'app-course-reviews',
  imports: [CommonModule, ReactiveFormsModule, StarRatingComponent],
  templateUrl: './course-reviews.component.html',
  styleUrl: './course-reviews.component.css'
})
export class CourseReviewsComponent implements OnInit {
  @Input() cursoId!: number;
  @Input() isEnrolled: boolean = false;

  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackbarService = inject(SnackbarService);

  reviews: Review[] = [];
  reviewStats: ReviewStats = { averageRating: 0, reviewCount: 0 };
  userReview: Review | null = null;
  hasReviewed: boolean = false;
  isLoading: boolean = false;
  showReviewForm: boolean = false;
  isEditMode: boolean = false;

  reviewForm: FormGroup = this.fb.group({
    calificacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comentario: ['', [Validators.maxLength(900)]]
  });

  ngOnInit(): void {
    this.loadReviews();
    this.loadReviewStats();
    if (this.authService.isUserLoggedIn()) {
      this.checkUserReview();
    }
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getReviewsByCourse(this.cursoId).subscribe({
      next: (response: any) => {
        this.reviews = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.snackbarService.showError('Error al cargar las reseñas');
        this.isLoading = false;
      }
    });
  }

  loadReviewStats(): void {
    this.reviewService.getCourseReviewStats(this.cursoId).subscribe({
      next: (response: any) => {
        this.reviewStats = response.data || { averageRating: 0, reviewCount: 0 };
      },
      error: (error) => {
        console.error('Error loading review stats:', error);
      }
    });
  }

  checkUserReview(): void {
    const userInfo = this.authService.getUserInfo();
    const userId = userInfo?.id;
    if (userId) {
      this.reviewService.checkUserReview(this.cursoId, userId).subscribe({
        next: (response: any) => {
          this.hasReviewed = response.data?.hasReviewed || false;
          if (this.hasReviewed) {
            this.loadUserReview();
          }
        },
        error: (error) => {
          console.error('Error checking user review:', error);
        }
      });
    }
  }

  loadUserReview(): void {
    const userInfo = this.authService.getUserInfo();
    const userId = userInfo?.id;
    if (userId) {
      this.reviewService.getReviewsByUser(userId).subscribe({
        next: (response: any) => {
          const allUserReviews = response.data || [];
          this.userReview = allUserReviews.find((r: Review) => r.cursoId === this.cursoId) || null;
          if (this.userReview) {
            this.reviewForm.patchValue({
              calificacion: this.userReview.calificacion,
              comentario: this.userReview.comentario || ''
            });
          }
        },
        error: (error) => {
          console.error('Error loading user review:', error);
        }
      });
    }
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.isEditMode = false;
      this.reviewForm.reset({ calificacion: 0, comentario: '' });
    }
  }

  startEdit(): void {
    this.isEditMode = true;
    this.showReviewForm = true;
    if (this.userReview) {
      this.reviewForm.patchValue({
        calificacion: this.userReview.calificacion,
        comentario: this.userReview.comentario || ''
      });
    }
  }

  onRatingChange(rating: number): void {
    this.reviewForm.patchValue({ calificacion: rating });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.snackbarService.showError('Por favor, selecciona una calificación válida');
      return;
    }

    const reviewData = {
      ...this.reviewForm.value,
      cursoId: this.cursoId
    };

    if (this.isEditMode && this.userReview) {
      // Update existing review
      this.reviewService.updateReview(this.userReview.id!, reviewData).subscribe({
        next: (response) => {
          this.snackbarService.showSuccess('Reseña actualizada exitosamente');
          this.showReviewForm = false;
          this.isEditMode = false;
          this.loadReviews();
          this.loadReviewStats();
          this.loadUserReview();
        },
        error: (error) => {
          this.snackbarService.showError(error.error?.message || 'Error al actualizar la reseña');
        }
      });
    } else {
      // Create new review
      this.reviewService.createReview(reviewData).subscribe({
        next: (response) => {
          this.snackbarService.showSuccess('Reseña creada exitosamente');
          this.showReviewForm = false;
          this.hasReviewed = true;
          this.loadReviews();
          this.loadReviewStats();
          this.loadUserReview();
        },
        error: (error) => {
          this.snackbarService.showError(error.error?.message || 'Error al crear la reseña');
        }
      });
    }
  }

  deleteReview(): void {
    if (!this.userReview) return;

    if (confirm('¿Estás seguro de que deseas eliminar tu reseña?')) {
      this.reviewService.deleteReview(this.userReview.id!).subscribe({
        next: (response) => {
          this.snackbarService.showSuccess('Reseña eliminada exitosamente');
          this.hasReviewed = false;
          this.userReview = null;
          this.showReviewForm = false;
          this.reviewForm.reset({ calificacion: 0, comentario: '' });
          this.loadReviews();
          this.loadReviewStats();
        },
        error: (error) => {
          this.snackbarService.showError(error.error?.message || 'Error al eliminar la reseña');
        }
      });
    }
  }

  get userRole(): string {
    return this.authService.getUserRole() || '';
  }

  get isStudent(): boolean {
    return this.userRole === 'ESTUDIANTE';
  }
}
