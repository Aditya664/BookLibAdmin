import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookService } from '../../../services/book.service';
import { GenreService } from '../../../services/genre.service';
import {
  Book,
  BookCreateRequest,
  BookUpdateRequest,
  LanguageType,
} from '../../../models/book.model';
import { MatIconModule } from '@angular/material/icon';
import { Genre } from '../../../models/genre.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode: boolean;
  loading = false;
  selectedFile: File | null = null;

  languages = Object.values(LanguageType);
  genres: Genre[] = [];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private genreService: GenreService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { book: Book | null; mode: 'create' | 'edit' }
  ) {
    this.isEditMode = data.mode === 'edit';
    this.bookForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadGenres();
    if (this.isEditMode && this.data.book) {
      this.populateForm(this.data.book);
    }
  }

  loadGenres(): void {
    this.genreService.getAllGenres().subscribe({
      next: (response) => {
        this.genres = response.data;
      },
      error: (error) => {
        console.error('Error loading genres:', error);
      },
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      author: ['', [Validators.required, Validators.minLength(1)]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      language: ['', Validators.required],
      genres: [[], Validators.required],
      description: [''],
      image: [''],
    });
  }

  populateForm(book: Book): void {
    this.bookForm.patchValue({
      title: book.title,
      author: book.author,
      rating: book.rating,
      language: book.language,
      genres: book.genres,
      description: book.description || '',
      image: book.image || '',
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.loading = true;
      const formValue = this.bookForm.value;
      const createRequest: BookCreateRequest = {
        ...formValue,
        genreIds: formValue.genres.map((g: Genre) => g.id),
      };
      if (!this.isEditMode) {
        this.bookService
          .createBookWithFile(createRequest, this.selectedFile ?? null)
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Book created successfully with PDF',
                'Close',
                {
                  duration: 3000,
                }
              );
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Error creating book with file:', error);
              this.snackBar.open('Failed to create book with PDF', 'Close', {
                duration: 3000,
              });
              this.loading = false;
            },
          });
      }else{
        const updateRequest:BookUpdateRequest={
            ...createRequest,
            id: this.data.book?.id ?? 0
        }
        this.bookService
        .updateBook(updateRequest, this.selectedFile ?? null)
        .subscribe({
          next: () => {
            this.snackBar.open(
              'Book Updated successfully with PDF',
              'Close',
              {
                duration: 3000,
              }
            );
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating book with file:', error);
            this.snackBar.open('Failed to create book with PDF', 'Close', {
              duration: 3000,
            });
            this.loading = false;
          },
        });
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.snackBar.open('Please select a valid PDF file', 'Close', {
        duration: 3000,
      });
      event.target.value = '';
      this.selectedFile = null;
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} must be at least ${field.errors?.['minlength']?.requiredLength} characters`;
    }
    if (field?.hasError('min')) {
      return `${fieldName} must be at least ${field.errors?.['min']?.min}`;
    }
    if (field?.hasError('pattern')) {
      return `${fieldName} format is invalid`;
    }
    return '';
  }

  compareGenres(genre1: Genre, genre2: Genre): boolean {
    return genre1 && genre2 ? genre1.id === genre2.id : genre1 === genre2;
  }
}
