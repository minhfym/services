import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatBadgeModule, MatChipsModule, MatTooltipModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="breadcrumb">{{ getBreadcrumb() }}</div>
      </div>
      <div class="header-right">
        <!-- Notifications -->
        <button mat-icon-button class="notif-btn" matTooltip="Notifications">
          <mat-icon [matBadge]="notifCount > 0 ? notifCount.toString() : null" matBadgeColor="warn">
            notifications
          </mat-icon>
        </button>

        <!-- Role Badge -->
        <div class="role-chip" [ngClass]="'role-' + currentUser?.role">
          <mat-icon class="chip-icon">{{ getRoleIcon() }}</mat-icon>
          <span>{{ getRoleLabel() }}</span>
        </div>

        <!-- User Avatar -->
        <div class="user-avatar" matTooltip="{{ currentUser?.email }}">
          {{ getUserInitials() }}
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 64px;
      min-height: 64px;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a237e;
      line-height: 1.2;
    }

    .breadcrumb {
      font-size: 12px;
      color: #9e9e9e;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .notif-btn { color: #616161; }

    .role-chip {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
    }

    .role-chip.role-admin {
      background: #ffebee;
      color: #c62828;
    }

    .role-chip.role-officer {
      background: #e3f2fd;
      color: #1565c0;
    }

    .role-chip.role-citizen {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .chip-icon { font-size: 14px; width: 14px; height: 14px; }

    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #1a237e;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  pageTitle = 'Dashboard';
  notifCount = 3;

  private routeTitles: Record<string, string> = {
    'dashboard':     'Dashboard',
    'taxes':         'Tax Collection',
    'permits':       'E-Permits',
    'lands':         'Land Administration',
    'grants':        'Grants Management',
    'cases':         'Law Cases',
    'registrations': 'Citizen Registrations',
  };

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const segment = e.url.split('/')[1]?.split('?')[0] || 'dashboard';
      this.pageTitle = this.routeTitles[segment] || 'GovPortal';
    });

    // Set initial title
    const segment = this.router.url.split('/')[1]?.split('?')[0] || 'dashboard';
    this.pageTitle = this.routeTitles[segment] || 'GovPortal';
  }

  getBreadcrumb(): string {
    return `GovPortal / ${this.pageTitle}`;
  }

  getRoleIcon(): string {
    switch (this.currentUser?.role) {
      case 'admin': return 'admin_panel_settings';
      case 'officer': return 'badge';
      case 'citizen': return 'person';
      default: return 'person';
    }
  }

  getRoleLabel(): string {
    switch (this.currentUser?.role) {
      case 'admin': return 'Admin';
      case 'officer': return 'Officer';
      case 'citizen': return 'Citizen';
      default: return 'User';
    }
  }

  getUserInitials(): string {
    const name = this.currentUser?.name || '';
    return name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';
  }
}
