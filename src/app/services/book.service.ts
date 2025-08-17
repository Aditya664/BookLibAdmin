import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Book, BookCreateRequest, BookUpdateRequest } from '../models/book.model';
import { CommonResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private endpoint = '/Books';

  constructor(private apiService: ApiService) {}

  getAllBooks(): Observable<CommonResponse<Book[]>> {
    return this.apiService.get<CommonResponse<Book[]>>(this.endpoint+'/getAllBooks');
  }

  getBookById(id: number): Observable<Book> {
    return this.apiService.get<Book>(`${this.endpoint}/${id}`);
  }

  createBook(book: BookCreateRequest, pdfFile?: File, imageFile?: File): Observable<Book> {
    const formData = new FormData();
  
    formData.append('Title', book.title);
    formData.append('Author', book.author);
    formData.append('Rating', book.rating.toString());
    formData.append('Description', book.description?.toString() ?? '');
    formData.append('Language', book.language);
  
    // Append multiple GenreIds
    if (book.genreIds && book.genreIds.length) {
      book.genreIds.forEach(id => formData.append('GenreIds', id.toString()));
    }
  
    // Append files if present
    if (imageFile) {
      formData.append('Image', imageFile, imageFile.name);
    }
    if (pdfFile) {
      formData.append('pdfFile', pdfFile, pdfFile.name);
    }
  
    return this.apiService.post<Book>(this.endpoint + '/bookupload', formData);
  }
  

  createBookWithFile(bookData: BookCreateRequest, pdfFile?: File | null): Observable<Book> {
    const formData = new FormData();
    
    // Add book data to FormData
    formData.append('title', bookData.title);
    formData.append('author', bookData.author);
    formData.append('rating', bookData.rating.toString());
    formData.append('description', bookData.description || '');
    formData.append('language', bookData.language);
    formData.append('image', bookData.image || '');
    
    // Add genre IDs as separate entries
    bookData.genreIds.forEach((genreId, index) => {
      formData.append(`genreIds[${index}]`, genreId.toString());
    });
    
    // Add PDF file if provided
    if (pdfFile) {
      formData.append('pdfFile', pdfFile);
    }

    return this.apiService.postFormData<Book>(this.endpoint+'/bookupload', formData);
  }

  updateBook(book: BookUpdateRequest, pdfFile?: File | null): Observable<Book> {
    const formData = new FormData();
  
    formData.append('Title', book.title ?? '');
    formData.append('Author', book.author ?? '');
    formData.append('Rating', book.rating?.toString() ?? '');
    formData.append('Description', book.description ?? '');
    formData.append('Language', book.language ?? '');
    formData.append('Image', book.image ?? '');
  
    // Append genres as repeated fields
    book.genreIds?.forEach((genreId) => {
      formData.append('GenreIds', genreId.toString());
    });
  
    if (pdfFile) {
      formData.append('pdfFile', pdfFile);
    }
  
    return this.apiService.putFormData<Book>( `${this.endpoint}/updateBook/${book.id}`, formData);
  }
  

  deleteBook(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/'deleteBook'/${id}`);
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.apiService.get<Book[]>(`${this.endpoint}/search?q=${encodeURIComponent(query)}`);
  }

  saveProgress(bookId: number, currentPage: number, totalPages: number): Observable<any> {
    return this.apiService.post(`${this.endpoint}/save-progress`, { bookId, currentPage, totalPages });
  }

  // Start session (when opening book)

}
