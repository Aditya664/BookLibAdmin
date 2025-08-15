import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardService } from '../../services/dashboard.service';
import { BookService } from '../../services/book.service';
import { DashboardStats, ActivityItem } from '../../models/dashboard.model';
import { Book } from '../../models/book.model';
import { interval, Subscription } from 'rxjs';

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
    MatMenuModule,
    MatSnackBarModule,
    DatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('countAnimation', [
      transition(':increment', [
        style({ transform: 'scale(1.2)', color: '#4caf50' }),
        animate('300ms ease-out', style({ transform: 'scale(1)', color: '*' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-50px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(50px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardStats: DashboardStats | null = null;
  popularBooks: Book[] = [];
  displayedColumns: string[] = ['type', 'description', 'timestamp'];
  loading = true;
  error: string | null = null;
  animatedNumbers = {
    totalBooks: 0,
    totalUsers: 0,
    totalBorrowedBooks: 0,
    totalAvailableBooks: 0
  };
  private refreshSubscription?: Subscription;
  private trendData = {
    books: 12,
    users: 8,
    borrowed: 0,
    available: 5
  };

  constructor(
    private dashboardService: DashboardService,
    private bookService: BookService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadPopularBooks();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;
    
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.dashboardStats = data;
        this.animateNumbers(data);
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
        this.animateNumbers(this.dashboardStats);
      }
    });
  }

  loadPopularBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (response) => {
        if (response.data) {
          this.popularBooks = response.data
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
        }
      },
      error: (error) => {
        console.error('Error loading popular books:', error);
        // Mock popular books data
        this.popularBooks = [
          { id: 1, title: 'Angular Complete Guide', author: 'John Doe', rating: 5, description: '', language: 'English' as any, image: '', genres: [], createdAt: new Date() },
          { id: 2, title: 'TypeScript Handbook', author: 'Jane Smith', rating: 4.8, description: '', language: 'English' as any, image: '', genres: [], createdAt: new Date() }
        ];
      }
    });
  }

  startAutoRefresh(): void {
    // Refresh data every 5 minutes
    this.refreshSubscription = interval(300000).subscribe(() => {
      this.loadDashboardData();
    });
  }

  private animateNumbers(data: DashboardStats): void {
    const duration = 1000;
    const steps = 50;
    const stepDuration = duration / steps;

    const animate = (target: number, current: number, property: keyof typeof this.animatedNumbers) => {
      const increment = (target - current) / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        this.animatedNumbers[property] = Math.round(current + (increment * step));
        
        if (step >= steps) {
          this.animatedNumbers[property] = target;
          clearInterval(timer);
        }
      }, stepDuration);
    };

    animate(data.totalBooks, this.animatedNumbers.totalBooks, 'totalBooks');
    animate(data.totalUsers, this.animatedNumbers.totalUsers, 'totalUsers');
    animate(data.totalBorrowedBooks, this.animatedNumbers.totalBorrowedBooks, 'totalBorrowedBooks');
    animate(data.totalAvailableBooks, this.animatedNumbers.totalAvailableBooks, 'totalAvailableBooks');
  }

  // Utility methods
  getCurrentTime(): Date {
    return new Date();
  }

  getTrendPercentage(type: string): number {
    return this.trendData[type as keyof typeof this.trendData] || 0;
  }

  getBorrowedTrendClass(): string {
    const trend = this.trendData.borrowed;
    if (trend > 0) return 'positive';
    if (trend < 0) return 'negative';
    return 'neutral';
  }

  getBorrowedTrendIcon(): string {
    const trend = this.trendData.borrowed;
    if (trend > 0) return 'trending_up';
    if (trend < 0) return 'trending_down';
    return 'trending_flat';
  }

  getBorrowedTrendText(): string {
    const trend = this.trendData.borrowed;
    if (trend > 0) return `+${trend}% from last month`;
    if (trend < 0) return `${trend}% from last month`;
    return 'Same as last month';
  }

  getRelativeTime(timestamp?: Date): string {
    if (!timestamp) return 'Unknown time';
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  trackActivity(index: number, activity: ActivityItem): number {
    return activity.id;
  }

  // Navigation methods
  navigateToBooks(): void {
    this.router.navigate(['/books']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToBorrowedBooks(): void {
    this.router.navigate(['/books'], { queryParams: { filter: 'borrowed' } });
  }

  navigateToAvailableBooks(): void {
    this.router.navigate(['/books'], { queryParams: { filter: 'available' } });
  }

  // Action methods
  toggleFilters(): void {
    this.snackBar.open('Filters feature coming soon!', 'Close', { duration: 3000 });
  }

  exportData(): void {
    this.snackBar.open('Export functionality coming soon!', 'Close', { duration: 3000 });
  }

  openSettings(): void {
    this.snackBar.open('Settings page coming soon!', 'Close', { duration: 3000 });
  }

  quickAddBook(): void {
    this.router.navigate(['/books/add']);
  }

  quickAddUser(): void {
    this.router.navigate(['/users/add']);
  }

  viewReports(): void {
    this.snackBar.open('Reports feature coming soon!', 'Close', { duration: 3000 });
  }

  manageGenres(): void {
    this.snackBar.open('Genre management coming soon!', 'Close', { duration: 3000 });
  }

  refreshActivity(): void {
    this.loadDashboardData();
    this.snackBar.open('Activity refreshed', 'Close', { duration: 2000 });
  }

  viewAllActivity(): void {
    this.snackBar.open('Activity history coming soon!', 'Close', { duration: 3000 });
  }

  viewActivityDetails(activity: ActivityItem): void {
    this.snackBar.open(`Activity: ${activity.description}`, 'Close', { duration: 4000 });
  }

  markAsRead(activity: ActivityItem): void {
    this.snackBar.open('Activity marked as read', 'Close', { duration: 2000 });
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
