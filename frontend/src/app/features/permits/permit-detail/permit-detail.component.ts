import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PermitService } from '../../../core/services/permit.service';
import { AuthService } from '../../../core/services/auth.service';
import { Permit } from '../../../core/models/permit.model';

@Component({
  selector: 'app-permit-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatSnackBarModule, MatProgressBarModule, MatDialogModule
  ],
  templateUrl: './permit-detail.component.html',
  styleUrl: './permit-detail.component.scss'
})
export class PermitDetailComponent implements OnInit {
  permit: Permit | null = null;
  loading = true;
  isOfficer = false;

  constructor(
    private permitService: PermitService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isOfficer = this.authService.isOfficer();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadPermit(+id);
  }

  loadPermit(id: number): void {
    this.permitService.getById(id).subscribe({
      next: (p) => { this.permit = p; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/permits']); }
    });
  }

  approve(): void {
    if (!this.permit) return;
    this.permitService.approve(this.permit.id).subscribe({
      next: (p) => {
        this.permit = p;
        this.snackBar.open('Permit approved!', 'Close', { duration: 3000, panelClass: ['success-snack'] });
      },
      error: (err) => this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000 })
    });
  }

  reject(): void {
    if (!this.permit) return;
    this.permitService.reject(this.permit.id, 'Rejected by officer').subscribe({
      next: (p) => {
        this.permit = p;
        this.snackBar.open('Permit rejected', 'Close', { duration: 3000 });
      },
      error: (err) => this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000 })
    });
  }
}
