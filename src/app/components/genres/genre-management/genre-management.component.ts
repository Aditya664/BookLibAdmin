import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GenreService } from '../../../services/genre.service';
import { Genre } from '../../../models/genre.model';
import { GenreFormDialogComponent } from '../genre-form-dialog/genre-form-dialog.component';

@Component({
  selector: 'app-genre-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './genre-management.component.html',
  styleUrl: './genre-management.component.scss'
})
export class GenreManagementComponent implements OnInit {
  genres: Genre[] = [];
  displayedColumns: string[] = ['name', 'booksCount', 'actions'];
  loading = false;
  error: string | null = null;

  constructor(
    private genreService: GenreService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {
    this.loading = true;
    this.error = null;
    
    this.genreService.getAllGenres().subscribe({
      next: (response) => {
        this.genres = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load genres';
        this.loading = false;
        console.error('Error loading genres:', error);
        this.snackBar.open('Failed to load genres', 'Close', { duration: 3000 });
      }
    });
  }

  openAddGenreDialog(): void {
    const dialogRef = this.dialog.open(GenreFormDialogComponent, {
      width: '500px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addGenre(result);
      }
    });
  }

  openEditGenreDialog(genre: Genre): void {
    const dialogRef = this.dialog.open(GenreFormDialogComponent, {
      width: '500px',
      data: { isEdit: true, genre: genre }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateGenre(genre.id!, result);
      }
    });
  }

  addGenre(genreData: any): void {
    this.genreService.addGenre(genreData).subscribe({
      next: (newGenre) => {
        this.loadGenres();
        this.snackBar.open('Genre added successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error adding genre:', error);
        this.snackBar.open('Failed to add genre', 'Close', { duration: 3000 });
      }
    });
  }

  updateGenre(id: number, genreData: any): void {
    this.genreService.updateGenre(id,genreData).subscribe({
        next: () => {
          this.loadGenres();
          this.snackBar.open('Genre updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error adding genre:', error);
          this.snackBar.open('Failed to updated genre', 'Close', { duration: 3000 });
        }
      });
  }

  deleteGenre(genre: Genre): void {
    if (confirm(`Are you sure you want to delete the genre "${genre.name}"?`)) {
      this.genres = this.genres.filter(g => g.id !== genre.id);
      this.snackBar.open('Genre deleted successfully', 'Close', { duration: 3000 });
    }
  }

  refreshGenres(): void {
    this.loadGenres();
  }
}
