import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <nav class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">
        <mat-icon class="logo-icon">account_balance</mat-icon>
        <span class="logo-text">GovPortal</span>
      </div>

      <!-- Role Banner -->
      <div class="role-banner" [ngClass]="'role-' + currentUser?.role">
        <mat-icon class="role-icon">{{ getRoleIcon() }}</mat-icon>
        <span class="role-label">{{ getRoleLabel() }}</span>
      </div>

      <!-- Navigation Items -->
      <ul class="nav-list">
        <li *ngFor="let item of getNavItems()" class="nav-item">
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' || item.route === '/' }"
            class="nav-link"
            [matTooltip]="item.label"
            matTooltipPosition="right"
          >
            <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </li>
      </ul>

      <!-- User Info + Logout -->
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ getUserInitials() }}</div>
          <div class="user-details">
            <span class="user-name">{{ currentUser?.name }}</span>
            <span class="user-email">{{ currentUser?.email }}</span>
          </div>
        </div>
        <button mat-icon-button class="logout-btn" (click)="logout()" matTooltip="Logout">
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      min-width: 260px;
      background: #1a237e;
      color: #fff;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 20px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #ffd740;
    }

    .logo-text {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #fff;
    }

    .role-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 16px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
    }

    .role-banner.role-admin {
      background: rgba(244, 67, 54, 0.25);
      border: 1px solid rgba(244, 67, 54, 0.5);
      color: #ff8a80;
    }

    .role-banner.role-officer {
      background: rgba(33, 150, 243, 0.25);
      border: 1px solid rgba(33, 150, 243, 0.5);
      color: #82b1ff;
    }

    .role-banner.role-citizen {
      background: rgba(76, 175, 80, 0.25);
      border: 1px solid rgba(76, 175, 80, 0.5);
      color: #69f0ae;
    }

    .role-icon { font-size: 16px; width: 16px; height: 16px; }

    .nav-list {
      list-style: none;
      padding: 8px 0;
      flex: 1;
      margin: 0;
    }

    .nav-item { margin: 2px 0; }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px;
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      border-radius: 0;
      transition: all 0.2s;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border-left: 3px solid transparent;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-left-color: rgba(255, 255, 255, 0.4);
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      border-left-color: #ffd740;
    }

    .nav-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .nav-label { white-space: nowrap; }

    .sidebar-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0,0,0,0.15);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      overflow: hidden;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #ffd740;
      color: #1a237e;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: 11px;
      color: rgba(255,255,255,0.55);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .logout-btn {
      color: rgba(255,255,255,0.6) !important;
    }

    .logout-btn:hover {
      color: #ff8a80 !important;
    }
  `]
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;

  private officerNavItems: NavItem[] = [
    { label: 'Dashboard',          icon: 'dashboard',         route: '/dashboard',      roles: ['admin', 'officer'] },
    { label: 'Tax Collection',     icon: 'receipt_long',      route: '/taxes',          roles: ['admin', 'officer'] },
    { label: 'E-Permits',          icon: 'assignment',        route: '/permits',        roles: ['admin', 'officer'] },
    { label: 'Land Administration',icon: 'map',               route: '/lands',          roles: ['admin', 'officer'] },
    { label: 'Grants',             icon: 'volunteer_activism', route: '/grants',        roles: ['admin', 'officer'] },
    { label: 'Law Cases',          icon: 'gavel',             route: '/cases',          roles: ['admin', 'officer'] },
    { label: 'Registrations',      icon: 'how_to_reg',        route: '/registrations',  roles: ['admin', 'officer'] },
  ];

  private citizenNavItems: NavItem[] = [
    { label: 'My Dashboard',       icon: 'home',              route: '/dashboard',      roles: ['citizen'] },
    { label: 'My Taxes',           icon: 'receipt',           route: '/taxes',          roles: ['citizen'] },
    { label: 'My Permits',         icon: 'description',       route: '/permits',        roles: ['citizen'] },
    { label: 'My Land',            icon: 'terrain',           route: '/lands',          roles: ['citizen'] },
    { label: 'Available Grants',   icon: 'card_giftcard',     route: '/grants',         roles: ['citizen'] },
    { label: 'My Cases',           icon: 'balance',           route: '/cases',          roles: ['citizen'] },
    { label: 'My Registrations',   icon: 'person_add',        route: '/registrations',  roles: ['citizen'] },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
  }

  getNavItems(): NavItem[] {
    const role = this.currentUser?.role;
    if (role === 'citizen') return this.citizenNavItems;
    return this.officerNavItems;
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
      case 'admin': return 'Administrator';
      case 'officer': return 'Government Officer';
      case 'citizen': return 'Citizen';
      default: return 'User';
    }
  }

  getUserInitials(): string {
    const name = this.currentUser?.name || '';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U';
  }

  logout(): void {
    this.auth.logout().subscribe({
      complete: () => this.router.navigate(['/login']),
      error: () => {
        this.auth.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}
