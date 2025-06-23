import { Routes } from '@angular/router';
import { SearchMovies } from './movies/pages/search-movies/search-movies';
import { MoviesCollections } from './movies/pages/movies-collections/movies-collections';
import { MovieDetails } from './movies/pages/movie-details/movie-details';
import { CollectionDetails } from './movies/pages/collection-details/collection-details';

export const routes: Routes = [
  {
    path: '',
    component: SearchMovies,
    children: [
      {
        path: 'modal/:id',
        component: MovieDetails,
        outlet: 'modal',
      },
    ],
  },
  { path: 'search', component: SearchMovies },
  {
    path: 'collections',
    children: [
      { path: '', component: MoviesCollections },
      { path: ':id', component: CollectionDetails },
    ],
  },
  {
    path: 'movies',
    component: SearchMovies,
    children: [
      {
        path: 'modal/:id',
        component: MovieDetails,
        outlet: 'modal',
      },
    ],
  },
];
