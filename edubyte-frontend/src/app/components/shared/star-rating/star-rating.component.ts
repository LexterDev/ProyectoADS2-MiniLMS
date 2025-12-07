import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() rating: number = 0; // Current rating value (0-5)
  @Input() readonly: boolean = false; // If true, stars are not clickable
  @Input() size: 'sm' | 'md' | 'lg' = 'md'; // Size of stars
  @Input() showCount: boolean = false; // Show rating count next to stars
  @Input() count: number = 0; // Number of reviews

  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0;

  get sizeClass(): string {
    const sizes = {
      sm: 'text-sm',
      md: 'text-xl',
      lg: 'text-3xl'
    };
    return sizes[this.size];
  }

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.rating = star;
      this.ratingChange.emit(this.rating);
    }
  }

  onStarHover(star: number): void {
    if (!this.readonly) {
      this.hoverRating = star;
    }
  }

  onMouseLeave(): void {
    this.hoverRating = 0;
  }

  getStarClass(star: number): string {
    const effectiveRating = this.hoverRating || this.rating;

    if (star <= effectiveRating) {
      return 'text-yellow-400'; // Filled star
    } else if (star - 0.5 <= effectiveRating) {
      return 'text-yellow-400'; // Half star (optional enhancement)
    } else {
      return 'text-gray-300'; // Empty star
    }
  }
}
