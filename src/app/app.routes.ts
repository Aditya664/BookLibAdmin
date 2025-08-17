import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'books', 
    loadComponent: () => import('./components/books/book-list/book-list.component').then(m => m.BookListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'users', 
    loadComponent: () => import('./components/users/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'genres', 
    loadComponent: () => import('./components/genres/genre-management/genre-management.component').then(m => m.GenreManagementComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
