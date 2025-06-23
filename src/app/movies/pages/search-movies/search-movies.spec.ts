import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMovies } from './search-movies';

describe('SearchMovies', () => {
  let component: SearchMovies;
  let fixture: ComponentFixture<SearchMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMovies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
