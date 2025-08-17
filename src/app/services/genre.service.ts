import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Genre, AddGenreRequest } from '../models/genre.model';
import { CommonResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private endpoint = '/Books';

  constructor(private apiService: ApiService) {}

  getAllGenres(): Observable<CommonResponse<Genre[]>> {
    return this.apiService.get<CommonResponse<Genre[]>>(`${this.endpoint}/getAllGenres`)
  }

  addGenre(genreData: AddGenreRequest): Observable<Genre> {
    return this.apiService.post<CommonResponse<Genre>>(`${this.endpoint}/addGenre`, genreData)
      .pipe(
        map(response => response.data)
      );
  }

  updateGenre(id: number,genreData: AddGenreRequest): Observable<Genre> {
    return this.apiService.put<CommonResponse<Genre>>(`${this.endpoint}/updateGenre/${id}`, genreData)
      .pipe(
        map(response => response.data)
      );
  }

  getGenreById(id: number): Observable<Genre> {
    return this.apiService.get<Genre>(`${this.endpoint}/${id}`);
  }
}
