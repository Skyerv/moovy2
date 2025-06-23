import { ChangeDetectorRef, Component } from '@angular/core';
import { CollectionService } from '../../services/collection-service';
import { ActivatedRoute } from '@angular/router';
import {
  createEmptyMovieCollection,
  MovieCollection,
} from '../../models/collection.interface';
import { MovieService } from '../../services/movie-service';
import { debounceTime, forkJoin } from 'rxjs';
import { MovieDetails } from '../../models/movie.interface';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsDialog } from '../../components/movie-details-dialog/movie-details-dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './collection-details.html',
  styleUrl: './collection-details.scss',
})
export class CollectionDetails {
  collectionId!: string;
  collection: MovieCollection | null = createEmptyMovieCollection();
  movieDetailsList!: MovieDetails[];
  selectedMovieIds = new Set<number>();
  hoveredMovieId: number | null = null;

  constructor(
    private collectionsService: CollectionService,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('id')!;
    this.collection =
      this.collectionsService.getCollectionById(this.collectionId) ?? null;

    if (this.collection) {
      this.loadMovies(this.collection?.movieIds);
    }
  }

  loadMovies(ids: number[]) {
    const requests = ids.map((id) => this.movieService.getMovieDetailsById(id));

    forkJoin(requests).subscribe({
      next: (responses: MovieDetails[]) => {
        this.movieDetailsList = responses;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes dos filmes:', err);
      },
    });
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

  removeMoviesFromCollection(): void {
    const selectedMoviesIdsArr = [...this.selectedMovieIds];
    selectedMoviesIdsArr.forEach((movieId) =>
      this.collectionsService.removeMovieFromCollection(
        this.collectionId,
        movieId
      )
    );

    setTimeout(() => {
      this.collection =
        this.collectionsService.getCollectionById(this.collectionId) ?? null;

      if (this.collection) {
        this.loadMovies(this.collection?.movieIds);
      }
      
    }, 200);
  }
}
