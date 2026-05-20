import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();

  currentUser: User | null = null;
  isOfficer = false;
  isCitizen = false;

  officerNavItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Tax Collection', icon: 'account_balance', route: '/taxes' },
    { label: 'E-Permits', icon: 'assignment', route: '/permits' },
    { label: 'Land Administration', icon: 'map', route: '/lands' },
    { label: 'Grants', icon: 'card_giftcard', route: '/grants' },
    { label: 'Grant Applications', icon: 'assignment_turned_in', route: '/grant-applications' },
    { label: 'Law Cases', icon: 'gavel', route: '/cases' },
    { label: 'Registrations', icon: 'how_to_reg', route: '/registrations' },
  ];

  citizenNavItems: NavItem[] = [
    { label: 'My Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'My Taxes', icon: 'receipt_long', route: '/taxes' },
    { label: 'My Permits', icon: 'approval', route: '/permits' },
    { label: 'My Land', icon: 'terrain', route: '/lands' },
    { label: 'Available Grants', icon: 'volunteer_activism', route: '/grants' },
    { label: 'My Applications', icon: 'fact_check', route: '/grant-applications' },
    { label: 'My Cases', icon: 'balance', route: '/cases' },
    { label: 'My Registrations', icon: 'badge', route: '/registrations' },
  ];

  get navItems(): NavItem[] {
    return this.isCitizen ? this.citizenNavItems : this.officerNavItems;
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isOfficer = this.authService.isOfficer();
    this.isCitizen = this.authService.isCitizen();
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

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getRoleLabel(): string {
    if (!this.currentUser) return '';
    const labels: Record<string, string> = {
      admin: 'Administrator',
      officer: 'Government Officer',
      citizen: 'Citizen'
    };
    return labels[this.currentUser.role] || this.currentUser.role;
  }

  getRoleColor(): string {
    if (!this.currentUser) return '#888';
    const colors: Record<string, string> = {
      admin: '#b71c1c',
      officer: '#1565c0',
      citizen: '#2e7d32'
    };
    return colors[this.currentUser.role] || '#888';
  }
}
