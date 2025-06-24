import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovieCollection } from '../../models/collection.interface';
import { CollectionService } from '../../services/collection-service';
import { CreateCollectionDialog } from '../../components/create-collection-dialog/create-collection-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies-collections',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDialogModule],
  templateUrl: './movies-collections.html',
  styleUrl: './movies-collections.scss',
})
export class MoviesCollections {
  collections: MovieCollection[] = [];

  constructor(
    private dialog: MatDialog,
    private collectionService: CollectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.collections = this.collectionService.getCollections();
  }

  openNewCollectionDialog(): void {
    const dialogRef = this.dialog.open(CreateCollectionDialog);

    dialogRef.afterClosed().subscribe((result: MovieCollection | undefined) => {
      if (result) {
        this.collectionService.addCollection(result);

        setTimeout(() => {
          this.collections = this.collectionService.getCollections();
        }, 500);
      }
    });
  }

  goToCollectionsDetailsPage(collectionId: string): void {
    this.router.navigate(['/collections', collectionId]);
  }
}
