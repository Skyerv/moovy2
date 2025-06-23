import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from "@angular/router";
import { MovieDetailsDialog } from "../../components/movie-details-dialog/movie-details-dialog";

@Component({
  selector: 'app-movie-details',
  standalone: false,
  templateUrl: './movie-details.html',
  styleUrls: ['./movie-details.scss'], // aqui com "s"
})
export class MovieDetails {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log("AAAA")
    const movieId = this.route.snapshot.paramMap.get('id');

    const dialogRef = this.dialog.open(MovieDetailsDialog, {
      data: { id: movieId },
      width: '80vw',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([{ outlets: { modal: null } }]);
    });
  }
}
