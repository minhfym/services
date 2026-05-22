import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

interface StatCard {
  label: string;
  value: string;
  icon: string;
  route: string;
  color: string;
  roles: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule],
  template: `
    <div class="dashboard">
      <div class="welcome-banner">
        <div class="welcome-text">
          <h2>Welcome back, {{ (currentUser?.name || '').split(' ')[0] || 'User' }}!</h2>
          <p>{{ getWelcomeSubtitle() }}</p>
        </div>
        <div class="welcome-date">
          <mat-icon>today</mat-icon>
          <span>{{ today | date:'fullDate' }}</span>
        </div>
      </div>

      <div class="stats-grid">
        <mat-card
          *ngFor="let card of getVisibleCards()"
          class="stat-card"
          [routerLink]="card.route"
          [style.border-left-color]="card.color"
        >
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <div class="stat-label">{{ card.label }}</div>
                <div class="stat-value">{{ card.value }}</div>
              </div>
              <div class="stat-icon-wrap" [style.background]="card.color + '20'">
                <mat-icon [style.color]="card.color">{{ card.icon }}</mat-icon>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <button
            mat-raised-button
            *ngFor="let action of getQuickActions()"
            [routerLink]="action.route"
            class="action-btn"
          >
            <mat-icon>{{ action.icon }}</mat-icon>
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 0; }

    .welcome-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: #fff;
      padding: 28px 32px;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(26,35,126,0.3);
    }

    .welcome-text h2 {
      margin: 0 0 6px;
      font-size: 24px;
      font-weight: 700;
    }

    .welcome-text p {
      margin: 0;
      opacity: 0.8;
      font-size: 14px;
    }

    .welcome-date {
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0.8;
      font-size: 13px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }

    .stat-card {
      cursor: pointer;
      border-left: 4px solid transparent;
      border-radius: 10px !important;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.12) !important;
      }
    }

    .stat-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
    }

    .stat-label {
      font-size: 13px;
      color: #616161;
      margin-bottom: 6px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #212121;
    }

    .stat-icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon { font-size: 28px; width: 28px; height: 28px; }
    }

    .quick-actions h3 {
      font-size: 16px;
      font-weight: 600;
      color: #212121;
      margin: 0 0 16px;
    }

    .actions-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .action-btn {
      border-radius: 8px !important;
      background: #1a237e !important;
      color: #fff !important;

      mat-icon { margin-right: 6px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  today = new Date();

  private allCards: StatCard[] = [
    { label: 'Active Tax Cases',      value: '142', icon: 'receipt_long',       route: '/taxes',         color: '#e53935', roles: ['admin','officer'] },
    { label: 'Pending Permits',       value: '38',  icon: 'assignment',          route: '/permits',       color: '#1e88e5', roles: ['admin','officer'] },
    { label: 'Land Records',          value: '891', icon: 'map',                 route: '/lands',         color: '#43a047', roles: ['admin','officer'] },
    { label: 'Active Grants',         value: '24',  icon: 'volunteer_activism',  route: '/grants',        color: '#fb8c00', roles: ['admin','officer'] },
    { label: 'Open Cases',            value: '67',  icon: 'gavel',               route: '/cases',         color: '#8e24aa', roles: ['admin','officer'] },
    { label: 'Registrations',         value: '315', icon: 'how_to_reg',          route: '/registrations', color: '#00897b', roles: ['admin','officer'] },
    { label: 'My Tax Bills',          value: '3',   icon: 'receipt',             route: '/taxes',         color: '#e53935', roles: ['citizen'] },
    { label: 'My Permits',            value: '2',   icon: 'description',         route: '/permits',       color: '#1e88e5', roles: ['citizen'] },
    { label: 'My Land Records',       value: '1',   icon: 'terrain',             route: '/lands',         color: '#43a047', roles: ['citizen'] },
    { label: 'Grant Applications',    value: '4',   icon: 'card_giftcard',       route: '/grants',        color: '#fb8c00', roles: ['citizen'] },
    { label: 'My Cases',              value: '2',   icon: 'balance',             route: '/cases',         color: '#8e24aa', roles: ['citizen'] },
  ];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
  }

  getVisibleCards(): StatCard[] {
    const role = this.currentUser?.role;
    return this.allCards.filter(c => c.roles.includes(role || ''));
  }

  getWelcomeSubtitle(): string {
    switch (this.currentUser?.role) {
      case 'admin': return 'System Administrator — Full access to all government services';
      case 'officer': return 'Government Officer — Manage and process citizen requests';
      case 'citizen': return 'Access your government services and track your applications';
      default: return 'Welcome to the Government Services Portal';
    }
  }

  getQuickActions() {
    const role = this.currentUser?.role;
    if (role === 'citizen') {
      return [
        { label: 'Pay Tax Bill',       icon: 'payments',     route: '/taxes' },
        { label: 'Apply for Permit',   icon: 'add_task',     route: '/permits/new' },
        { label: 'Apply for Grant',    icon: 'redeem',       route: '/grants' },
        { label: 'File Registration',  icon: 'person_add',   route: '/registrations/new' },
      ];
    }
    return [
      { label: 'Create Tax Record',    icon: 'add',          route: '/taxes/new' },
      { label: 'Review Permits',       icon: 'pending',      route: '/permits' },
      { label: 'Process Applications', icon: 'fact_check',   route: '/grants' },
      { label: 'Manage Cases',         icon: 'gavel',        route: '/cases' },
    ];
  }
}
