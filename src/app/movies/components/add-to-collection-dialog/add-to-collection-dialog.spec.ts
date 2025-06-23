import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCollectionDialog } from './add-to-collection-dialog';

describe('AddToCollectionDialog', () => {
  let component: AddToCollectionDialog;
  let fixture: ComponentFixture<AddToCollectionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToCollectionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToCollectionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
