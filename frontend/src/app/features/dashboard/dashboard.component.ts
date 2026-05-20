import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DashboardService, DashboardStats, ActivityItem } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    total_tax_collections: 0,
    active_permits: 0,
    registered_lands: 0,
    open_cases: 0,
    grant_applications: 0,
    pending_registrations: 0
  };

  recentActivity: ActivityItem[] = [];
  loading = true;

  monthlyData = [
    { month: 'Jan', amount: 42000, label: '$42K' },
    { month: 'Feb', amount: 58000, label: '$58K' },
    { month: 'Mar', amount: 51000, label: '$51K' },
    { month: 'Apr', amount: 67000, label: '$67K' },
    { month: 'May', amount: 73000, label: '$73K' },
    { month: 'Jun', amount: 89000, label: '$89K' },
  ];

  maxMonthly = 0;

  statCards = [
    { key: 'total_tax_collections', label: 'Tax Collections', icon: 'account_balance', color: '#1a237e', isCurrency: true, route: '/taxes' },
    { key: 'active_permits', label: 'Active Permits', icon: 'assignment', color: '#2e7d32', isCurrency: false, route: '/permits' },
    { key: 'registered_lands', label: 'Registered Lands', icon: 'map', color: '#e65100', isCurrency: false, route: '/lands' },
    { key: 'open_cases', label: 'Open Cases', icon: 'gavel', color: '#b71c1c', isCurrency: false, route: '/cases' },
    { key: 'grant_applications', label: 'Grant Applications', icon: 'card_giftcard', color: '#6a1b9a', isCurrency: false, route: '/grant-applications' },
    { key: 'pending_registrations', label: 'Pending Registrations', icon: 'how_to_reg', color: '#f57f17', isCurrency: false, route: '/registrations' },
  ];

  quickActions = [
    { label: 'New Tax Record', icon: 'add_circle', route: '/taxes/new', color: '#1a237e' },
    { label: 'New Permit', icon: 'assignment_add', route: '/permits/new', color: '#2e7d32' },
    { label: 'Register Land', icon: 'add_location', route: '/lands/new', color: '#e65100' },
    { label: 'New Case', icon: 'gavel', route: '/cases/new', color: '#b71c1c' },
    { label: 'New Registration', icon: 'person_add', route: '/registrations/new', color: '#6a1b9a' },
    { label: 'New Grant', icon: 'volunteer_activism', route: '/grants/new', color: '#f57f17' },
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.maxMonthly = Math.max(...this.monthlyData.map(d => d.amount));

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Use placeholder data
        this.stats = {
          total_tax_collections: 284500,
          active_permits: 142,
          registered_lands: 1847,
          open_cases: 38,
          grant_applications: 95,
          pending_registrations: 23
        };
      }
    });

    this.dashboardService.getRecentActivity().subscribe({
      next: (data) => { this.recentActivity = data; },
      error: () => {
        this.recentActivity = [
          { id: 1, type: 'tax', description: 'Tax payment received from John Doe', timestamp: new Date().toISOString(), status: 'paid' },
          { id: 2, type: 'permit', description: 'Construction permit approved for ABC Corp', timestamp: new Date().toISOString(), status: 'approved' },
          { id: 3, type: 'registration', description: 'New citizen registration submitted', timestamp: new Date().toISOString(), status: 'pending' },
          { id: 4, type: 'case', description: 'Land dispute case #2024-089 filed', timestamp: new Date().toISOString(), status: 'open' },
          { id: 5, type: 'grant', description: 'Education grant application reviewed', timestamp: new Date().toISOString(), status: 'under_review' },
        ];
      }
    });
  }

  getStatValue(key: string): number {
    return (this.stats as any)[key] || 0;
  }

  getBarHeight(amount: number): number {
    return (amount / this.maxMonthly) * 100;
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      tax: 'account_balance',
      permit: 'assignment',
      land: 'map',
      case: 'gavel',
      grant: 'card_giftcard',
      registration: 'how_to_reg'
    };
    return icons[type] || 'info';
  }
}
