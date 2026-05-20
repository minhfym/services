import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  breadcrumb = 'Dashboard';

  private routeMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/taxes': 'Tax Collection',
    '/taxes/new': 'New Tax Record',
    '/permits': 'E-Permits',
    '/permits/new': 'New Permit',
    '/lands': 'Land Administration',
    '/lands/new': 'New Land Record',
    '/grants': 'Grants Management',
    '/grants/new': 'New Grant',
    '/grant-applications': 'Grant Applications',
    '/cases': 'Law Cases',
    '/cases/new': 'New Case',
    '/registrations': 'Citizen Registrations',
    '/registrations/new': 'New Registration',
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.updateBreadcrumb(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateBreadcrumb(event.url);
    });
  }

  updateBreadcrumb(url: string): void {
    const path = url.split('?')[0];
    if (this.routeMap[path]) {
      this.breadcrumb = this.routeMap[path];
    } else if (path.match(/\/\w+\/\d+$/)) {
      const base = path.replace(/\/\d+$/, '');
      const baseName = this.routeMap[base] || 'Details';
      this.breadcrumb = baseName + ' / Detail';
    } else {
      this.breadcrumb = 'Dashboard';
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}
