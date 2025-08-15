import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book, LanguageType } from '../../../models/book.model';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, AfterViewInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  displayedColumns: string[] = ['image', 'title', 'rating', 'author', 'language', 'genres', 'actions'];

    loading = false;
  searchQuery = '';
  dataSource = new MatTableDataSource<Book>([]);
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    console.log('BookListComponent initialized');
  }

  ngOnInit(): void {
    console.log('Initializing BookListComponent');
    this.dataSource = new MatTableDataSource<Book>([]);
    
    // Set up the filter predicate
    this.dataSource.filterPredicate = (data: Book, filter: string): boolean => {
      if (!filter) return true;
      
      const filterValue = filter.toLowerCase();
      const titleMatch = data.title.toLowerCase().includes(filterValue);
      const authorMatch = data.author.toLowerCase().includes(filterValue);
      const genreMatch = data.genres?.some(genre => 
        genre.name.toLowerCase().includes(filterValue)
      );
      
      return titleMatch || authorMatch || genreMatch;
    };
    
    this.loadBooks();
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  openBookPreview(book: Book): void {
    if (book.pdfFile) {
      window.open(book.pdfFile, '_blank');
    } else {
      this.snackBar.open('No preview available for this book', 'Close', {
        duration: 3000
      });
    }
  }

  readBook(book: Book): void {
    if (book.pdfFile) {
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(book.pdfFile);
      window.open(book.pdfFile, '_blank');
    } else {
      this.snackBar.open('No PDF file available for this book', 'Close', {
        duration: 3000
      });
    }
  }

  downloadBook(book: Book): void {
    if (book.pdfFile) {
      const link = document.createElement('a');
      link.href = book.pdfFile;
      link.download = book.pdfFileName || `book-${book.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      this.snackBar.open('No downloadable file available for this book', 'Close', {
        duration: 3000
      });
    }
  }

  loadBooks(): void {
    this.loading = true;
    console.log('Fetching books from API...');
    this.bookService.getAllBooks().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        // Ensure we have a valid response with data
        if (response && response.success && Array.isArray(response.data)) {
          // Map the API response to match our Book interface
          this.books = response.data.map(book => ({
            ...book,
            // Ensure all required fields are present
            genres: book.genres || [],
            createdAt: book.createdAt ? new Date(book.createdAt) : new Date(),
            // Ensure image has a default if not provided
            image: book.image || 'assets/default-book-cover.jpg',
            // Ensure rating is a number
            rating: book.rating ? Number(book.rating) : 0
          }));
          
          console.log('Mapped books:', this.books);
          this.filteredBooks = [...this.books];
          this.dataSource.data = this.filteredBooks;
          
          // Force update the view
          this.cdr.detectChanges();
          
          console.log('DataSource data length:', this.dataSource.data.length);
          console.log('Table should now be visible with data');
        } else {
          console.warn('Unexpected API response format');
          this.books = [];
          this.filteredBooks = [];
          this.dataSource.data = [];
          this.cdr.detectChanges();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.snackBar.open('Failed to load books: ' + (error.error?.message || error.message || 'Unknown error'), 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
        this.filteredBooks = [];
        
        // Fallback to mock data if API fails
        this.useMockData();
      }
    });
  }
  
  private useMockData(): void {
    console.log('Using mock data');
    // Clear any existing data
    this.books = [];
    this.filteredBooks = [];
    
    // Add a small delay to simulate API call
    setTimeout(() => {
      this.filteredBooks = [...this.books];
      this.loading = false;
    }, 500);
  }

  searchBooks(): void {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    
    // If search is cleared, restore full data
    if (!filterValue) {
      this.dataSource.data = this.books;
    }
  }

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '600px',
      data: { book: null, mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBooks();
      }
    });
  }

  openEditBookDialog(book: Book): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '600px',
      data: { book: book, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBooks();
      }
    });
  }

  deleteBook(book: Book): void {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      this.bookService.deleteBook(book.id!).subscribe({
        next: () => {
          this.snackBar.open('Book deleted successfully', 'Close', { duration: 3000 });
          this.loadBooks();
        },
        error: (error) => {
          console.error('Error deleting book:', error);
          this.snackBar.open('Failed to delete book', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
