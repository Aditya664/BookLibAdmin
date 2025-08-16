import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, UserCreateRequest, UserUpdateRequest } from '../models/user.model';
import { CommonResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = '/User';

  constructor(private apiService: ApiService) {}

  getAllUsers(): Observable<CommonResponse<User[]>> {
    return this.apiService.get<CommonResponse<User[]>>(this.endpoint+"/all");
  }

  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/${id}`);
  }

  createUser(user: UserCreateRequest): Observable<User> {
    return this.apiService.post<User>(this.endpoint, user);
  }

  updateUser(user: UserUpdateRequest): Observable<User> {
    return this.apiService.put<User>(`${this.endpoint}/${user.id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  toggleUserStatus(id: string): Observable<User> {
    return this.apiService.put<User>(`${this.endpoint}/${id}/toggle-status`, {});
  }
}
