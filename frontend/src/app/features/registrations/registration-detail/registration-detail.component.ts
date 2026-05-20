import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RegistrationService } from '../../../core/services/registration.service';
import { AuthService } from '../../../core/services/auth.service';
import { Registration } from '../../../core/models/registration.model';

@Component({
  selector: 'app-registration-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './registration-detail.component.html',
  styleUrl: './registration-detail.component.scss'
})
export class RegistrationDetailComponent implements OnInit {
  registration: Registration | null = null;
  loading = true;
  isOfficer = false;

  constructor(
    private registrationService: RegistrationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isOfficer = this.authService.isOfficer();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.registrationService.getById(+id).subscribe({
      next: (r) => { this.registration = r; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/registrations']); }
    });
  }

  approve(): void {
    if (!this.registration) return;
    this.registrationService.approve(this.registration.id).subscribe({
      next: (r) => {
        this.registration = r;
        this.snackBar.open('Registration approved!', 'Close', { duration: 3000, panelClass: ['success-snack'] });
      },
      error: (err) => this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000 })
    });
  }

  reject(): void {
    if (!this.registration) return;
    this.registrationService.reject(this.registration.id, 'Rejected by officer').subscribe({
      next: (r) => {
        this.registration = r;
        this.snackBar.open('Registration rejected', 'Close', { duration: 3000 });
      },
      error: (err) => this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000 })
    });
  }
}
