import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import {
  createNewMovieSearchQuery,
  Movie,
  MovieSearchQuery,
} from '../../models/movie.interface';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subject,
  Subscription,
} from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MovieDetailsDialog } from '../../components/movie-details-dialog/movie-details-dialog';
import { AddToCollectionDialog } from '../../components/add-to-collection-dialog/add-to-collection-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search-movies',
  standalone: false,
  templateUrl: './search-movies.html',
  styleUrl: './search-movies.scss',
})
export class SearchMovies {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private searchInput$ = new Subject<string>();

  searchQuery: MovieSearchQuery = createNewMovieSearchQuery();
  totalResults = 0;
  isLoading: boolean = false;
  movies!: Movie[];
  carouselMovies: Movie[] = [];
  lastSearchTerm: string = '';
  currentSlide = 0;
  intervalId: any;
  selectedMovieIds = new Set<number>();
  hoveredMovieId: number | null = null;

  private sub!: Subscription;

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
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

    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild;
        if (child?.snapshot.paramMap.has('id')) {
          const movieId = +child.snapshot.paramMap.get('id')!;
          if (
            !this.dialog.openDialogs.find((d) => d.id === 'details-' + movieId)
          ) {
            this.openMovieDialog(movieId, true);
          }
        }
      });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
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
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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

  openMovieDialog(movieId: number, viaRoute = false): void {
    // I had to take out the logic of making the dialog open in
    // a new route because it was causing an error that I could
    // not figure out.

    // Maybe if I put the movies into a NgRx Store it would help,
    // but unfortunately I don't have enough time to do it.

    // If you want to see the routing logic working,
    // just un-comment the code lines below.
    
    // The routing logic will work, but some other stuff will break.

    setTimeout(() => {
      if (!viaRoute) {
        //this.router.navigate(['/movies', movieId, 'details']);
      }
    }, 300);

    const dialogRef = this.dialog.open(MovieDetailsDialog, {
      id: 'details-' + movieId,
      data: movieId,
      width: '600px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(() => {
      //this.router.navigate(['/movies']);
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

    dialogRef
      .afterClosed()
      .pipe(debounceTime(300))
      .subscribe((collectionId) => {
        this.selectedMovieIds.clear();
        clearInterval(this.intervalId);
        this.router.navigate(['/collections', collectionId]);
        this.snackBar.open('Successfully added movie(s) to collection.', 'OK', {
          duration: 5000,
        });
      });
  }
}
