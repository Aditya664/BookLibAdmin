import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats, ActivityItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashboardStats: DashboardStats | null = null;
  displayedColumns: string[] = ['type', 'description', 'timestamp'];
  loading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;
    
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.dashboardStats = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load dashboard data';
        this.loading = false;
        console.error('Dashboard error:', error);
        // Mock data for development
        this.dashboardStats = {
          totalBooks: 150,
          totalUsers: 45,
          totalBorrowedBooks: 23,
          totalAvailableBooks: 127,
          recentActivity: [
            {
              id: 1,
              type: 'BOOK_ADDED',
              description: 'New book "Angular Complete Guide" added',
              timestamp: new Date()
            },
            {
              id: 2,
              type: 'USER_REGISTERED',
              description: 'New user John Doe registered',
              timestamp: new Date(Date.now() - 3600000)
            }
          ]
        };
      }
    });
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'BOOK_ADDED': return 'add_circle';
      case 'BOOK_BORROWED': return 'book';
      case 'BOOK_RETURNED': return 'assignment_return';
      case 'USER_REGISTERED': return 'person_add';
      default: return 'info';
    }
  }

  getActivityIconClass(type: string): string {
    return `activity-icon-${type.toLowerCase().replace('_', '-')}`;
  }

  getActivityStatus(type: string): string {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  getActivityChipClass(type: string): string {
    switch(type) {
      case 'BOOK_ADDED': return 'chip-success';
      case 'BOOK_BORROWED': return 'chip-warning';
      case 'BOOK_RETURNED': return 'chip-info';
      case 'USER_REGISTERED': return 'chip-primary';
      default: return 'chip-default';
    }
  }
}
