import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesCollections } from './movies-collections';

describe('MoviesCollections', () => {
  let component: MoviesCollections;
  let fixture: ComponentFixture<MoviesCollections>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesCollections]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesCollections);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
