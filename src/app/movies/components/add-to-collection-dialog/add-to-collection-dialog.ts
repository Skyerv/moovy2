import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CollectionService } from '../../services/collection-service';
import { MovieCollection } from '../../models/collection.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-add-to-collection-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatListModule,
    MatRadioModule,
  ],
  templateUrl: './add-to-collection-dialog.html',
  styleUrl: './add-to-collection-dialog.scss',
})
export class AddToCollectionDialog {
  collections: MovieCollection[] = [];
  selectedCollectionId: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { moviesIds: number[] },
    private dialogRef: MatDialogRef<AddToCollectionDialog>,
    private collectionService: CollectionService
  ) {
    this.collections = this.collectionService.getCollections();
  }

  onConfirm() {
    this.collectionService.addMoviesToCollection(
      this.selectedCollectionId,
      this.data.moviesIds
    );

    this.dialogRef.close(this.selectedCollectionId);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
