import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MovieCollection } from '../../models/collection.interface';
import { Movie } from '../../models/movie.interface';
import { CollectionService } from '../../services/collection-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-collection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './create-collection-dialog.html',
  styleUrl: './create-collection-dialog.scss',
})
export class CreateCollectionDialog {
  title = '';
  description = '';

  constructor(private dialogRef: MatDialogRef<CreateCollectionDialog>) {}

  onCancel() {
    this.dialogRef.close();
  }

  onCreate() {
    if (this.title.trim()) {
      this.dialogRef.close({
        id: crypto.randomUUID(),
        title: this.title,
        description: this.description,
        movieIds: [],
      });
    }
  }
}
