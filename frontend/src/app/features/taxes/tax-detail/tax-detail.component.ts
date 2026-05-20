import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TaxService } from '../../../core/services/tax.service';
import { AuthService } from '../../../core/services/auth.service';
import { Tax } from '../../../core/models/tax.model';

@Component({
  selector: 'app-tax-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatSnackBarModule, MatProgressBarModule
  ],
  templateUrl: './tax-detail.component.html',
  styleUrl: './tax-detail.component.scss'
})
export class TaxDetailComponent implements OnInit {
  tax: Tax | null = null;
  loading = true;
  isOfficer = false;

  constructor(
    private taxService: TaxService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isOfficer = this.authService.isOfficer();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadTax(+id);
  }

  loadTax(id: number): void {
    this.taxService.getById(id).subscribe({
      next: (tax) => { this.tax = tax; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/taxes']); }
    });
  }

  markAsPaid(): void {
    if (!this.tax) return;
    this.taxService.markAsPaid(this.tax.id).subscribe({
      next: (updated) => {
        this.tax = updated;
        this.snackBar.open('Marked as paid!', 'Close', { duration: 3000, panelClass: ['success-snack'] });
      },
      error: (err) => this.snackBar.open(err?.error?.detail || 'Failed', 'Close', { duration: 3000 })
    });
  }
}
