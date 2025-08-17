import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { DashboardStats, CommonResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private endpoint = '/Dashboard';

  constructor(private apiService: ApiService) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.apiService.get<CommonResponse<DashboardStats>>(`${this.endpoint}/stats`)
      .pipe(
        map(response => response.data)
      );
  }
}
