import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Genre } from '../models/book.model';
import { CommonResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private endpoint = '/Books';

  constructor(private apiService: ApiService) {}

  getAllGenres(): Observable<CommonResponse<Genre[]>> {
    return this.apiService.get<CommonResponse<Genre[]>>(this.endpoint+'/getAllGenres');
  }

  getGenreById(id: number): Observable<Genre> {
    return this.apiService.get<Genre>(`${this.endpoint}/${id}`);
  }
}
