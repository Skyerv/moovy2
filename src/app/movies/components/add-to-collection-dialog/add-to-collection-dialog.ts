import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CollectionService } from '../../services/collection-service';
import { MovieCollection } from '../../models/collection.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-add-to-collection-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatListModule,
  ],
  templateUrl: './add-to-collection-dialog.html',
  styleUrl: './add-to-collection-dialog.scss'
})
export class AddToCollectionDialog {
  collections: MovieCollection[] = [];
    selectedCollections: string[] = [];
    
   constructor(
    @Inject(MAT_DIALOG_DATA) public data: {moviesIds: number[]},
    private dialogRef: MatDialogRef<AddToCollectionDialog>,
    private collectionService: CollectionService
  ) {
    this.collections = this.collectionService.getCollections();
  }

  onConfirm() {
    this.selectedCollections.forEach((collectionId) => {
      this.collectionService.addMoviesToCollection(
        collectionId,
        this.data.moviesIds
      );
    });
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
