import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchMovies } from './pages/search-movies/search-movies';
import { MaterialSharedModule } from '../shared/material-shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes';

@NgModule({
  declarations: [SearchMovies],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MaterialSharedModule,
    BrowserAnimationsModule,
  ],
})
export class MoviesModule {}
