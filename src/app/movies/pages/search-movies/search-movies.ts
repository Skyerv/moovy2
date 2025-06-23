import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import {
  createNewMovieSearchQuery,
  Movie,
  MovieSearchQuery,
} from '../../models/movie.interface';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MovieDetails } from '../movie-details/movie-details';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MovieDetailsDialog } from '../../components/movie-details-dialog/movie-details-dialog';
import { CreateCollectionDialog } from '../../components/create-collection-dialog/create-collection-dialog';
import { AddToCollectionDialog } from '../../components/add-to-collection-dialog/add-to-collection-dialog';

@Component({
  selector: 'app-search-movies',
  standalone: false,
  templateUrl: './search-movies.html',
  styleUrl: './search-movies.scss',
})
export class SearchMovies {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalResults = 0;
  isLoading: boolean = false;
  searchQuery: MovieSearchQuery = createNewMovieSearchQuery();
  private searchInput$ = new Subject<string>();
  movies!: Movie[];
  carouselMovies!: Movie[];
  lastSearchTerm: string = '';
  currentSlide = 0;
  intervalId: any;
  selectedMovieIds = new Set<number>(); 
  hoveredMovieId: number | null = null;

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPopularMovies();

    this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.lastSearchTerm = term;
        if (term.length >= 3) {
          this.searchQuery = { query: term, page: 1 };
          this.paginator.firstPage();
          this.searchMovies();
        } else {
          this.movies = [];
          this.totalResults = 0;
        }
      });
  }

  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  onPageChange(event: PageEvent): void {
    this.searchQuery.page = event.pageIndex + 1;
    this.searchMovies();
  }

  searchMovies(): void {
    this.isLoading = true;

    this.movieService.searchMovies(this.searchQuery).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalResults = response.total_results;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }

  startAutoSlide() {
    clearInterval(this.intervalId); 

    this.intervalId = setInterval(() => {
      if (this.carouselMovies.length > 1) {
        this.currentSlide =
          (this.currentSlide + 1) % this.carouselMovies.length;
      }
      this.cdr.detectChanges();
    }, 5000); 
  }

  getTransform(): string {
    return `translateX(-${(this.currentSlide * 100)}%)`;
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  getPopularMovies(): void {
    this.movieService.getPopularMovies().subscribe((response) => {
      if (!this.movies) {
        this.movies = response.results;
      }

      const validMovies = response.results.filter((m) => m.backdrop_path);

      this.carouselMovies = validMovies;
      this.currentSlide = 0; 

      clearInterval(this.intervalId); 

      if (this.carouselMovies.length > 1) {
        this.startAutoSlide();
      }
    });
  }

  prevSlide() {
    if (this.carouselMovies.length === 0) return;

    this.currentSlide =
      (this.currentSlide - 1 + this.carouselMovies.length) %
      this.carouselMovies.length;
  }

  nextSlide() {
    if (this.carouselMovies.length === 0) return;

    this.currentSlide = (this.currentSlide + 1) % this.carouselMovies.length;
  }

  goToSlide(index: number) {
    if (index >= 0 && index < this.carouselMovies.length) {
      this.currentSlide = index;
    }
  }

  openMovieDialog(movieId: number): void {
    this.dialog.open(MovieDetailsDialog, {
      data: movieId,
      width: '600px',
      panelClass: 'custom-dialog-container',
    });
  }

  toggleMovieSelection(movieId: number): void {
  if (this.selectedMovieIds.has(movieId)) {
    this.selectedMovieIds.delete(movieId);
  } else {
    this.selectedMovieIds.add(movieId);
  }
}

isMovieSelected(movieId: number): boolean {
  return this.selectedMovieIds.has(movieId);
}

openAddToCollectionDialog(): void {
  const dialogRef = this.dialog.open(AddToCollectionDialog, {
    data: { moviesIds: [...this.selectedMovieIds] },
    width: '400px',
  });

  dialogRef.afterClosed().subscribe(() => {
    this.selectedMovieIds.clear(); 
  });
}
}
