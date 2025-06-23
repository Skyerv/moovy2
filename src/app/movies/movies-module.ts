import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchMovies } from './pages/search-movies/search-movies';
import { MovieDetails } from './pages/movie-details/movie-details';
import { MaterialSharedModule } from '../shared/material-shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes';
import { MoviesCollections } from './pages/movies-collections/movies-collections';
import { CollectionDetails } from './pages/collection-details/collection-details';

@NgModule({
  declarations: [SearchMovies, MovieDetails],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MaterialSharedModule,
    BrowserAnimationsModule,
  ],
})
export class MoviesModule {}
