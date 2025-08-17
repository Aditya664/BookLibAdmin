import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;
  
  title = 'book-library-admin';
  showNavigation = false;
  currentUser$ = this.authService.currentUser$;
  sidenavOpened = true;
  isHandset = false;

  menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/books', icon: 'library_books', label: 'Books' },
    { path: '/users', icon: 'people', label: 'Users' },
    { path: '/genres', icon: 'category', label: 'Manage Genres' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    // Set initial navigation state based on current URL
    this.showNavigation = !this.router.url.includes('/login');
    
    // Hide navigation on login page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showNavigation = !event.url.includes('/login');
        }
      });

    // Handle responsive behavior
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isHandset = result.matches;
        if (this.isHandset) {
          this.sidenavOpened = false;
        } else {
          this.sidenavOpened = true;
        }
      });
  }

  toggleSidenav(): void {
    if (this.drawer) {
      this.drawer.toggle();
      this.sidenavOpened = !this.sidenavOpened;
    }
  }

  closeSidenavOnMobile(): void {
    if (this.isHandset && this.drawer) {
      this.drawer.close();
      this.sidenavOpened = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
