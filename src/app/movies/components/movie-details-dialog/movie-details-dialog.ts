import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  createNewMovieDetails,
  Movie,
  MovieDetails,
} from '../../models/movie.interface';
import { MovieService } from '../../services/movie-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './movie-details-dialog.html',
  styleUrl: './movie-details-dialog.scss',
})
export class MovieDetailsDialog {
  @Output() ratingChange = new EventEmitter<number>();

  movieDetails$!: Observable<MovieDetails>;
  userRating: number | null = null;
  rating: number | null = 0;
  stars = Array(10).fill(0);
  hoveredRating = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public movieId: number,
    private dialogRef: MatDialogRef<MovieDetailsDialog>,
    private movieService: MovieService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovieDetails();
  }

  onClose() {
    this.dialogRef.close();
  }

  getMovieDetails(): void {
    this.movieDetails$ = this.movieService.getMovieDetailsById(this.movieId);
  }

  setRating(value: number) {
    this.rating = value;
    this.ratingChange.emit(this.rating);
  }

  hoverRating(value: number) {
    this.hoveredRating = value;
  }

  submitRating(): void {
    if (!this.rating || this.rating < 1 || this.rating > 10) {
      this.snackBar.open('Please enter a rating between 1 and 10.', 'OK', {
        duration: 5000,
      });
      return;
    }

    this.movieService.getGuestSessionId().subscribe({
      next: (sessionResponse) => {
        const sessionId = sessionResponse.guest_session_id;

        this.movieDetails$.subscribe((movieDetails) => {
          this.rateMovie(movieDetails, sessionId);
        });
      },
      error: () => {
        this.snackBar.open('Failed to get session ID.', 'OK', {
          duration: 5000,
        });
      },
    });
  }

  rateMovie(movieDetails: MovieDetails, sessionId: string): void {
    this.movieService
      .rateMovie(movieDetails.id, this.rating!, sessionId)
      .subscribe({
        next: () => {
          this.snackBar.open('Thank you for your rating!', 'OK', {
            duration: 5000,
          });
          this.rating = null;
        },
        error: () => {
          this.snackBar.open('Error submitting your rating.', 'OK', {
            duration: 5000,
          });
        },
      });
  }
}
