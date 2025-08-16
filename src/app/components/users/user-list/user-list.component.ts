import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  displayedColumns: string[] = ['userInfo', 'fullName', 'roles', 'status', 'actions'];
  loading = true;
  searchQuery = '';

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.data;
        this.filteredUsers = users.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
        this.loading = false;
        this.users = [];
        this.filteredUsers = this.users;
      }
    });
  }

  searchUsers(): void {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(user =>
      user.userName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (user.firstName && user.firstName.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }


  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.userName}"?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getRoleColor(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'primary';
      case UserRole.USER: return 'accent';
      default: return '';
    }
  }

  getRoleClass(roles: string[]): string {
    const primaryRole = roles && roles.length > 0 ? roles[0].toLowerCase() : '';
    switch (primaryRole) {
      case 'admin': return 'admin';
      case 'user': return 'user';
      case 'moderator': return 'moderator';
      default: return '';
    }
  }

  getInitials(user: User): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    // Fallback to first two letters of username or email
    const name = user.userName || user.email;
    return name.substring(0, 2).toUpperCase();
  }

  getFullName(user: User): string {
    return user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }

  getRolesDisplay(roles: string[]): string {
    return roles && roles.length > 0 ? roles.join(', ') : 'No Role';
  }

  openAddUserDialog(): void {
    // TODO: Implement add user dialog
    this.snackBar.open('Add user functionality coming soon', 'Close', { duration: 3000 });
  }

  openEditUserDialog(user: User): void {
    // TODO: Implement edit user dialog
    this.snackBar.open('Edit user functionality coming soon', 'Close', { duration: 3000 });
  }
}
