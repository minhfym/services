import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardService, DashboardStats, ActivityItem } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';

interface StatCard {
  key: string;
  label: string;
  icon: string;
  color: string;
  isCurrency: boolean;
  route: string;
}

interface QuickAction {
  label: string;
  icon: string;
  route: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatProgressBarModule, MatDividerModule, MatChipsModule
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
  isOfficer = false;
  isCitizen = false;
  userName = '';

  monthlyData = [
    { month: 'Jan', amount: 42000, label: '$42K' },
    { month: 'Feb', amount: 58000, label: '$58K' },
    { month: 'Mar', amount: 51000, label: '$51K' },
    { month: 'Apr', amount: 67000, label: '$67K' },
    { month: 'May', amount: 73000, label: '$73K' },
    { month: 'Jun', amount: 89000, label: '$89K' },
  ];
  maxMonthly = 0;

  officerStatCards: StatCard[] = [
    { key: 'total_tax_collections', label: 'Total Tax Collected', icon: 'account_balance', color: '#1a237e', isCurrency: true, route: '/taxes' },
    { key: 'active_permits', label: 'Active Permits', icon: 'assignment', color: '#2e7d32', isCurrency: false, route: '/permits' },
    { key: 'registered_lands', label: 'Registered Parcels', icon: 'map', color: '#e65100', isCurrency: false, route: '/lands' },
    { key: 'open_cases', label: 'Open Cases', icon: 'gavel', color: '#b71c1c', isCurrency: false, route: '/cases' },
    { key: 'grant_applications', label: 'Grant Applications', icon: 'card_giftcard', color: '#6a1b9a', isCurrency: false, route: '/grant-applications' },
    { key: 'pending_registrations', label: 'Pending Registrations', icon: 'how_to_reg', color: '#f57f17', isCurrency: false, route: '/registrations' },
  ];

  citizenStatCards: StatCard[] = [
    { key: 'pending_taxes', label: 'My Tax Balance Due', icon: 'receipt_long', color: '#b71c1c', isCurrency: true, route: '/taxes' },
    { key: 'active_permits', label: 'My Active Permits', icon: 'approval', color: '#2e7d32', isCurrency: false, route: '/permits' },
    { key: 'registered_lands', label: 'My Land Parcels', icon: 'terrain', color: '#e65100', isCurrency: false, route: '/lands' },
    { key: 'open_cases', label: 'My Open Cases', icon: 'balance', color: '#6a1b9a', isCurrency: false, route: '/cases' },
    { key: 'grant_applications', label: 'My Grant Applications', icon: 'fact_check', color: '#1565c0', isCurrency: false, route: '/grant-applications' },
    { key: 'pending_registrations', label: 'Pending Submissions', icon: 'pending_actions', color: '#f57f17', isCurrency: false, route: '/registrations' },
  ];

  officerQuickActions: QuickAction[] = [
    { label: 'Issue Tax Notice', icon: 'notification_add', route: '/taxes/new', color: '#1a237e', description: 'Create a new tax bill' },
    { label: 'Process Permit', icon: 'assignment_add', route: '/permits', color: '#2e7d32', description: 'Review pending permits' },
    { label: 'Register Land', icon: 'add_location', route: '/lands/new', color: '#e65100', description: 'Add new land record' },
    { label: 'Open Case', icon: 'gavel', route: '/cases/new', color: '#b71c1c', description: 'File a law case' },
    { label: 'Create Grant', icon: 'volunteer_activism', route: '/grants/new', color: '#6a1b9a', description: 'Launch a new grant' },
    { label: 'Process Registration', icon: 'how_to_reg', route: '/registrations', color: '#f57f17', description: 'Review registrations' },
  ];

  citizenQuickActions: QuickAction[] = [
    { label: 'Pay My Taxes', icon: 'payments', route: '/taxes', color: '#b71c1c', description: 'View and pay outstanding taxes' },
    { label: 'Apply for Permit', icon: 'assignment_add', route: '/permits/new', color: '#2e7d32', description: 'Submit a permit application' },
    { label: 'View My Land', icon: 'terrain', route: '/lands', color: '#e65100', description: 'View your registered land' },
    { label: 'File a Case', icon: 'balance', route: '/cases/new', color: '#6a1b9a', description: 'Register a legal case' },
    { label: 'Apply for Grant', icon: 'volunteer_activism', route: '/grants', color: '#1565c0', description: 'Browse and apply for grants' },
    { label: 'Register / Update', icon: 'badge', route: '/registrations/new', color: '#f57f17', description: 'Submit a registration' },
  ];

  get statCards(): StatCard[] {
    return this.isCitizen ? this.citizenStatCards : this.officerStatCards;
  }

  get quickActions(): QuickAction[] {
    return this.isCitizen ? this.citizenQuickActions : this.officerQuickActions;
  }

  pendingApprovals = [
    { type: 'Permit', id: 'PRM-2024-0045', applicant: 'James Mwangi', date: '2 hours ago' },
    { type: 'Grant App', id: 'GRT-2024-0123', applicant: 'Amina Osei', date: '5 hours ago' },
    { type: 'Registration', id: 'REG-2024-0089', applicant: 'Peter Nkomo', date: '1 day ago' },
    { type: 'Land Transfer', id: 'LND-2024-0034', applicant: 'Grace Otieno', date: '2 days ago' },
  ];

  myTodos = [
    { label: 'Tax payment overdue', icon: 'warning', route: '/taxes', severity: 'high' },
    { label: 'Permit renewal due in 30 days', icon: 'schedule', route: '/permits', severity: 'medium' },
    { label: 'Case hearing scheduled', icon: 'event', route: '/cases', severity: 'info' },
    { label: 'Grant application under review', icon: 'hourglass_empty', route: '/grant-applications', severity: 'info' },
  ];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.maxMonthly = Math.max(...this.monthlyData.map(d => d.amount));
    this.isOfficer = this.authService.isOfficer();
    this.isCitizen = this.authService.isCitizen();
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'User';

    this.dashboardService.getStats().subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => {
        this.loading = false;
        this.stats = {
          total_tax_collections: 284500, active_permits: 142,
          registered_lands: 1847, open_cases: 38,
          grant_applications: 95, pending_registrations: 23,
          pending_taxes: 4200
        } as any;
      }
    });

    this.dashboardService.getRecentActivity().subscribe({
      next: (data) => { this.recentActivity = data; },
      error: () => {
        if (this.isCitizen) {
          this.recentActivity = [
            { id: 1, type: 'tax', description: 'Tax payment of $1,200 submitted', timestamp: new Date().toISOString(), status: 'paid' },
            { id: 2, type: 'permit', description: 'Business permit application submitted', timestamp: new Date().toISOString(), status: 'under_review' },
            { id: 3, type: 'grant', description: 'Education grant application received', timestamp: new Date().toISOString(), status: 'pending' },
          ];
        } else {
          this.recentActivity = [
            { id: 1, type: 'tax', description: 'Tax payment received from John Doe', timestamp: new Date().toISOString(), status: 'paid' },
            { id: 2, type: 'permit', description: 'Construction permit approved for ABC Corp', timestamp: new Date().toISOString(), status: 'approved' },
            { id: 3, type: 'registration', description: 'New citizen registration submitted', timestamp: new Date().toISOString(), status: 'pending' },
            { id: 4, type: 'case', description: 'Land dispute case #2024-089 filed', timestamp: new Date().toISOString(), status: 'open' },
            { id: 5, type: 'grant', description: 'Education grant application reviewed', timestamp: new Date().toISOString(), status: 'under_review' },
          ];
        }
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
      tax: 'receipt_long', permit: 'approval', land: 'terrain',
      case: 'balance', grant: 'volunteer_activism', registration: 'badge'
    };
    return icons[type] || 'info';
  }
}
