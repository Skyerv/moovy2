import { Routes } from '@angular/router';
import { SearchMovies } from './movies/pages/search-movies/search-movies';
import { MoviesCollections } from './movies/pages/movies-collections/movies-collections';
import { CollectionDetails } from './movies/pages/collection-details/collection-details';
import { MovieDetailsDialog } from './movies/components/movie-details-dialog/movie-details-dialog';

export const routes: Routes = [
  {
    path: '',
    component: SearchMovies,
    children: [{ path: 'movies/:id/details', component: MovieDetailsDialog }],
  },
  {
    path: 'movies',
    component: SearchMovies,
    children: [{ path: 'movies/:id/details', component: MovieDetailsDialog }],
  },
  {
    path: 'collections',
    children: [
      { path: '', component: MoviesCollections },
      { path: ':id', component: CollectionDetails },
    ],
  },
];
