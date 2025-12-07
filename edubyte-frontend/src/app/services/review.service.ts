import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { AuthService } from './auth.service';
import { Review, ReviewStats, CreateReviewRequest, UpdateReviewRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  /**
   * Create a new review for a course
   */
  createReview(reviewData: CreateReviewRequest): Observable<any> {
    return this.http.post(API_ENDPOINTS.reviews.create, reviewData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Update an existing review
   */
  updateReview(reviewId: number, reviewData: UpdateReviewRequest): Observable<any> {
    return this.http.put(API_ENDPOINTS.reviews.update(reviewId), reviewData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Delete a review
   */
  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(API_ENDPOINTS.reviews.delete(reviewId), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Get all reviews for a specific course
   */
  getReviewsByCourse(cursoId: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.reviews.getByCourse(cursoId));
  }

  /**
   * Get all reviews by a specific user
   */
  getReviewsByUser(userId: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.reviews.getByUser(userId), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Get review statistics for a course (average rating and count)
   */
  getCourseReviewStats(cursoId: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.reviews.getStats(cursoId));
  }

  /**
   * Check if a user has already reviewed a course
   */
  checkUserReview(cursoId: number, userId: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.reviews.checkUserReview(cursoId, userId), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }
}
